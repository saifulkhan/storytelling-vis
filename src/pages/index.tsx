import React from "react";
import type { ReactElement } from "react";

import PresentationLayout from "../layouts/Presentation";
import PostMountRedirectToPage from "../components/PostMountRedirectToPages";

function Presentation() {
  return (
    <React.Fragment>
      <PostMountRedirectToPage data={{ page: "/storyboards/covid19-sl-story" }}>
      </PostMountRedirectToPage>
    </React.Fragment>
  );
}

Presentation.getLayout = function getLayout(page: ReactElement<any>) {
  return <PresentationLayout>{page}</PresentationLayout>;
};

export default Presentation;
