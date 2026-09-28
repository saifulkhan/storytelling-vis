import * as d3 from 'd3';
import { Plot } from './Plot';
import {
  Coordinate,
  Seekable,
  TimeSeriesData,
  TimeSeriesPoint,
  TimelineAction,
} from '../../types';
import { prefersReducedMotion } from '../../common';

export type TimelinePlotProps = {
  /** left/right margins reserve space before and after the track */
  margin: { top: number; right: number; bottom: number; left: number };
  trackColor: string;
  progressColor: string;
  /** fill of the checkpoints the progress bar has already passed */
  visitedCheckpointColor: string;
  /** fill of the checkpoints not reached yet */
  upcomingCheckpointColor: string;
  checkpointStroke: string;
  checkpointStrokeWidth: number;
  checkpointRadius: number;
  trackWidth: number;
  fontFamily: string;
  fontSize: string;
  /** duration in ms of a progress animation across the full track */
  animationDuration: number;
};

export const defaultTimelinePlotProps: TimelinePlotProps = {
  margin: { top: 0, right: 50, bottom: 0, left: 50 },
  trackColor: '#E2F0F3',
  progressColor: '#A9D2DB',
  visitedCheckpointColor: '#CCEAF5',
  upcomingCheckpointColor: '#EEF8FC',
  checkpointStroke: 'white',
  checkpointStrokeWidth: 2,
  checkpointRadius: 8,
  trackWidth: 8,
  fontFamily: 'Arial Narrow',
  fontSize: '12px',
  animationDuration: 5000,
};

/**
 * A horizontal progress timeline with one checkpoint per timeline action.
 * As the story advances, the progress bar animates from the previous
 * checkpoint to the current one and shows the date reached. Typically
 * drawn below another plot and driven, together with it, by a
 * ScrollStoryController.
 */
export class TimelinePlot
  extends Plot<TimeSeriesData, TimelinePlotProps>
  implements Seekable
{
  data: TimeSeriesData = [];
  name = '';
  plotProps: TimelinePlotProps = defaultTimelinePlotProps;

  svg!: SVGSVGElement;
  width: number = 0;
  height: number = 0;
  xAxis: any;

  timelineActions: TimelineAction[] = [];
  currentIndex: number = -1;

  constructor() {
    super();
  }

  public setPlotProps(props: Partial<TimelinePlotProps>) {
    this.plotProps = { ...defaultTimelinePlotProps, ...props };
    return this;
  }

  public setData(data: TimeSeriesData) {
    this.data = data;
    return this;
  }

  public setName(name: string) {
    this.name = name;
    return this;
  }

  public setCanvas(svg: SVGSVGElement) {
    this.svg = svg;
    this.clean();

    const bounds = svg.getBoundingClientRect();
    this.width = bounds.width;
    this.height = bounds.height;

    return this;
  }

  public setActions(timelineActions: TimelineAction[] = []) {
    this.timelineActions = timelineActions.sort(
      (a, b) => a[0].getTime() - b[0].getTime(),
    );
    this.currentIndex = -1;
    return this;
  }

  /**
   * Draw the timeline at the current story step without animation.
   */
  public plot() {
    this._draw(this.currentIndex, false);
    return this;
  }

  /**
   * Animate the progress bar to the given timeline action index. A negative
   * index resets the timeline; an index past the last action fills the
   * whole track.
   */
  public animateTo(index: number) {
    this.currentIndex = index;
    this._draw(index, true);
    return this;
  }

  /*
   * Given a date, return the corresponding [x, y] coordinate on the track
   * (origin and destination are the same point).
   */
  public getCoordinates(date: Date): [Coordinate, Coordinate] {
    const x = this.xAxis ? this.xAxis(date) : 0;
    const y = this.height / 2;
    return [
      [x, y],
      [x, y],
    ];
  }

  private _draw(index: number, animated: boolean) {
    if (!this.svg) {
      return;
    }

    this.clean();

    const p = this.plotProps;
    const count = this.timelineActions.length;
    const y = this.height / 2;
    const trackStart = p.margin.left;
    const trackEnd = this.width - p.margin.right;

    const selection = d3.select(this.svg);

    // track
    selection
      .append('line')
      .attr('x1', trackStart)
      .attr('x2', trackEnd)
      .attr('y1', y)
      .attr('y2', y)
      .attr('stroke', p.trackColor)
      .style('stroke-width', p.trackWidth);

    if (!this.data.length) {
      return;
    }

    this.xAxis = d3
      .scaleTime()
      .domain(
        d3.extent(this.data, (d: TimeSeriesPoint) => d.date) as [Date, Date],
      )
      .range([trackStart, trackEnd]);

    if (index < 0 || count === 0) {
      // initial state: only the track and unvisited checkpoints
      this._drawCheckpoints(selection, -1, y, 0);
      return;
    }

    const idx = Math.min(index, count);

    // the progress up to the previous checkpoint is already filled; only
    // the segment up to the current checkpoint is animated
    const progressStart =
      idx > 0 ? this.xAxis(this.timelineActions[idx - 1][0]) : trackStart;
    const progressEnd =
      idx < count ? this.xAxis(this.timelineActions[idx][0]) : trackEnd;

    // duration proportional to the animated fraction of the track
    const ratio = (progressEnd - progressStart) / (trackEnd - trackStart || 1);
    const duration =
      animated && !prefersReducedMotion() ? ratio * p.animationDuration : 0;

    selection
      .append('line')
      .attr('x1', trackStart)
      .attr('x2', progressStart)
      .attr('y1', y)
      .attr('y2', y)
      .attr('stroke', p.progressColor)
      .style('stroke-width', p.trackWidth)
      .transition()
      .duration(duration)
      .ease(d3.easeLinear)
      .attr('x2', progressEnd);

    this._drawCheckpoints(selection, idx, y, duration);

    // date reached by the progress bar, revealed once the animation ends
    const date =
      idx < count
        ? this.timelineActions[idx][0]
        : this.data[this.data.length - 1].date;

    selection
      .append('text')
      .style('opacity', 0)
      .text(date.toLocaleDateString())
      .attr('font-size', p.fontSize)
      .attr('font-family', p.fontFamily)
      .attr('fill', 'currentColor')
      .attr(
        'text-anchor',
        progressEnd > (trackStart + trackEnd) / 2 ? 'end' : 'start',
      )
      .attr(
        'transform',
        `translate(${progressEnd},${y - p.checkpointRadius - 6})`,
      )
      .transition()
      .delay(duration)
      .style('opacity', 1);
  }

  private _drawCheckpoints(
    selection: any,
    idx: number,
    y: number,
    duration: number,
  ) {
    const p = this.plotProps;

    this.timelineActions.forEach((timelineAction: TimelineAction, i) => {
      const checkpoint = selection
        .append('circle')
        .attr('r', p.checkpointRadius)
        .attr('cx', this.xAxis(timelineAction[0]))
        .attr('cy', y)
        .attr(
          'fill',
          i < idx ? p.visitedCheckpointColor : p.upcomingCheckpointColor,
        )
        .attr('stroke', p.checkpointStroke)
        .attr('stroke-width', p.checkpointStrokeWidth);

      // the current checkpoint fills once the progress bar reaches it
      if (i === idx) {
        checkpoint
          .transition()
          .delay(duration)
          .duration(0)
          .attr('fill', p.visitedCheckpointColor);
      }
    });
  }
}
