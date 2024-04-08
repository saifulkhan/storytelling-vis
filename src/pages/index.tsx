import React from "react";
import type { ReactElement } from "react";

import PresentationLayout from "../layouts/Presentation";
// import AppBar from "../components/pages/landing/AppBar";
// import Introduction from "../components/pages/landing/Introduction";
// import Demos from "../components/pages/landing/Demos";
// import Testimonial from "../components/pages/landing/Testimonial";
// import Integrations from "../components/pages/landing/Integrations";
// import Features from "../components/pages/landing/Features";
// import FAQ from "../components/pages/landing/FAQ";
// import JoinUs from "../components/pages/landing/JoinUs";
import PostMountRedirectToPage from "../components/PostMountRedirectToPages";

function Presentation() {
  return (
    <React.Fragment>
      <PostMountRedirectToPage data={{ page: "/storyboards/covid19-sl-story" }}>
        {/* <AppBar />
        <Introduction />
        <Demos />
        <Testimonial />
        <Integrations />
        <Features />
        <FAQ />
        <JoinUs /> */}
      </PostMountRedirectToPage>
    </React.Fragment>
  );
}

Presentation.getLayout = function getLayout(page: ReactElement) {
  return <PresentationLayout>{page}</PresentationLayout>;
};

export default Presentation;
