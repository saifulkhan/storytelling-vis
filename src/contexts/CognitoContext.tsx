import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
} from "react";

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

import {
  ActionMap,
  AuthState,
  AuthUser,
  CognitoContextType,
} from "../types/auth";

import axios from "../utils/axios";
import { cognitoConfig } from "../config";

const INITIALIZE = "INITIALIZE";
const SIGN_OUT = "SIGN_OUT";

const UserPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId || "",
  ClientId: cognitoConfig.clientId || "",
});

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

type AuthActionTypes = {
  [INITIALIZE]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [SIGN_OUT]: undefined;
};

type CognitoActions =
  ActionMap<AuthActionTypes>[keyof ActionMap<AuthActionTypes>];

const reducer = (state: AuthState, action: CognitoActions) => {
  if (action.type === INITIALIZE) {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }
  if (action.type === SIGN_OUT) {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  }
  return state;
};

const AuthContext = createContext<CognitoContextType | null>(null);

function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getUserAttributes = useCallback(
    (currentUser: CognitoUser): Record<string, any> =>
      new Promise((resolve, reject) => {
        currentUser.getUserAttributes((err, attributes) => {
          if (err) {
            reject(err);
          } else {
            const results: Record<string, any> = {};

            attributes?.forEach((attribute) => {
              results[attribute.Name] = attribute.Value;
            });
            resolve(results);
          }
        });
      }),
    []
  );

  const getSession = useCallback(
    () =>
      new Promise((resolve, reject) => {
        const user = UserPool.getCurrentUser();
        if (user) {
          user.getSession(
            async (err: Error | null, session: CognitoUserSession | null) => {
              if (err) {
                reject(err);
              } else {
                const attributes = await getUserAttributes(user);
                const token = session?.getIdToken().getJwtToken();

                axios.defaults.headers.common.Authorization = token!;

                dispatch({
                  type: INITIALIZE,
                  payload: { isAuthenticated: true, user: attributes },
                });

                resolve({
                  user,
                  session,
                  headers: { Authorization: token },
                });
              }
            }
          );
        } else {
          dispatch({
            type: INITIALIZE,
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      }),
    [getUserAttributes]
  );

  const initialize = useCallback(async () => {
    try {
      await getSession();
    } catch {
      dispatch({
        type: INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
  }, [getSession]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const signIn = useCallback(
    (email: any, password: any) =>
      new Promise((resolve, reject) => {
        const user = new CognitoUser({
          Username: email,
          Pool: UserPool,
        });

        const authDetails = new AuthenticationDetails({
          Username: email,
          Password: password,
        });

        user.authenticateUser(authDetails, {
          onSuccess: async (data) => {
            await getSession();
            resolve(data);
          },
          onFailure: (err) => {
            reject(err);
          },
          newPasswordRequired: () => {
            resolve({ message: "New password required" });
          },
        });
      }),
    [getSession]
  );

  const signOut = () => {
    const user = UserPool.getCurrentUser();
    if (user) {
      user.signOut();
      dispatch({ type: SIGN_OUT });
    }
  };

  const signUp = (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) =>
    new Promise((resolve, reject) => {
      UserPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({ Name: "email", Value: email }),
          new CognitoUserAttribute({
            Name: "name",
            Value: `${firstName} ${lastName}`,
          }),
        ],
        [],
        async (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(undefined);
          // Set destination URL here
          window.location.href = "";
        }
      );
    });

  const resetPassword = (email: string) => console.log(email);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "cognito",
        user: {
          displayName: state?.user?.name || "Undefined",
          role: "user",
          ...state.user,
        },
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
