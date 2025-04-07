import { useRouter } from "next/router";
import * as React from "react";

export interface PostMountRedirectToPageProps {
  data: Record<string, string>;
  children?: React.ReactNode;
}

const PostMountRedirectToPage: React.FunctionComponent<
  PostMountRedirectToPageProps
> = ({ data, children }) => {
  const [ready, setReady] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    if (data?.page) {
      router.replace(data?.page);
    } else {
      setReady(true);
    }
  }, [data, data?.page, router]);

  if (!ready) {
    return <div></div>;
  }

  return <>{children}</>;
};

export default PostMountRedirectToPage;
