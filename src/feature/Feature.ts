export abstract class Feature {
  protected date: Date;
  protected start: Date;
  protected end: Date;
  protected rank: number;
  protected metric: string;
  protected dataIndex: number;

  constructor() {
    this.date = new Date();
    this.start = new Date();
    this.end = new Date();
    this.rank = 0;
    this.metric = '';
    this.dataIndex = 0;
  }

  setDate(date: Date) {
    this.date = date;
    return this;
  }

  getDate() {
    return this.date;
  }

  setRank(rank: number) {
    this.rank = rank;
    return this;
  }

  getRank() {
    return this.rank;
  }

  setMetric(metric: string) {
    this.metric = metric;
    return this;
  }

  getMetric() {
    return this.metric;
  }

  setStart(start: Date) {
    this.start = start;
    return this;
  }

  getStart() {
    return this.start;
  }

  setEnd(end: Date) {
    this.end = end;
    return this;
  }

  getEnd() {
    return this.end;
  }

  setDataIndex(index: number) {
    this.dataIndex = index;
    return this;
  }

  getDataIndex() {
    return this.dataIndex;
  }

  // TODO:
  getDuration() {
    if (!this.start || !this.end)
      throw "This object doesn't have an end or start.";
    const difference = this.end.getTime() - this.start.getTime();
    const dayInMs = 1000 * 3600 * 24;
    return Math.floor(difference / dayInMs);
  }
}
