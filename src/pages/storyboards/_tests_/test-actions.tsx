import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Dot } from "src/components/storyboards/actions/Dot";
import { TextBox } from "src/components/storyboards/actions/TextBox";
import { Connector } from "src/components/storyboards/actions/Connector";
import { Circle } from "src/components/storyboards/actions/Circle";
import {
  AbstractAction,
  Coordinate,
} from "src/components/storyboards/actions/AbstractAction";

const TestActions = () => {
  const chartRef = useRef(null);

  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const height = 500 - margin.top - margin.bottom;
  const width = 1000 - margin.left - margin.right;

  useEffect(() => {
    if (!chartRef.current) return;

    let ignore = false;

    if (!ignore) {
      console.log("useEffect triggered");

      const svg = d3
        .select(chartRef.current)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        // .attr("transform", `translate(${margin.left},${margin.top})`)
        .node();

      const src: Coordinate = [400, 300];
      const dest: Coordinate = [400, 200];
      const dest1: Coordinate = [400, 100];

      const textBox = new TextBox()
        .properties({
          title: "17-02-2024",
          message:
            "By {DATE}, the number of cases continued to climb higher in {REGION}. The best of the BBC, with the latest news and sport headlines, weather, TV & radio highlights and much more from across the whole of BBC Online.",
        })
        .svg(svg)
        .draw()
        .coordinate(dest, dest1);

      const dot = new Dot()
        .properties({
          size: 5,
          color: "#FF0000",
          opacity: 0.5,
        })
        .svg(svg)
        .draw()
        .coordinate(src, dest);

      /*
      const connector = new Connector()
        .properties({})
        .svg(svg)
        .draw()
        .coordinate(src, dest);

        */
      /*
      const circle = new Circle()
        .properties({
          size: 10,
          color: "#000000",
          opacity: 1,
        })
        .svg(svg)
        .draw()
        .coordinate(src, dest);
      */

      const animate = async () => {
        await textBox.show();
        await textBox.move([400, 300]);

        await dot.show();
        // await dot.move([400, 300]);

        // animate individually
        /*
        await Promise.all([
          textBox.show(),
          dot.show(),
          circle.show(),
          connector.show(),
        ]);

        await Promise.all([
          textBox.hide(),
          dot.hide(),
          circle.hide(),
          connector.hide(),
        ]);

        await Promise.all([
          textBox.show(),
          dot.show(),
          circle.show(),
          connector.show(),
        ]);

        // animate together
        
        const actions = [textBox, dot, circle, connector];
        await AbstractAction.show(actions);
        await AbstractAction.hide(actions);
        await AbstractAction.show(actions);
       */
      };

      animate();
    }

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <svg
        ref={chartRef}
        style={{ width: width, height: height, border: "1px solid" }}
      ></svg>
    </>
  );
};

export default TestActions;
