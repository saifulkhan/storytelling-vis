import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { RootState } from "../redux/store";

// Use throughout your app instead of plain `useSelector`
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
