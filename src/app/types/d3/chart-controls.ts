export type ChartOptions = {
    type: 'line' | 'bar';
    title: string;
}

export type MarginOptions = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export type DimensionOptions = {
    height: number;
    width: number;
}

export type MarkerOptions = {
    enabled: boolean;
    stroke: number;
    strokeColour: string;
    strokeOpacity: number;
    size: number;
    colour: string;
    opacity: number;
}

export type LineOptions = {
    stroke: number;
    colour: string;
}

export type BarOptions = {
    width: number;
    colour: string;
}

export type XAxisOptions = {
    fontSize: number;
    rotation: number;
    textAnchor: 'start' | 'middle' | 'end';
    dateFormat: string;
    baseUnit: 'day' | 'week' | 'month' | 'year';
    every: number;
    title: string;
}

export type YAxisOptions = {
    fontSize: number;
    ticks: number;
    tickFormat: string;
    gridLines: {
        enabled: boolean;
    }
    min: number;
    max: number;
    minAuto: boolean;
    maxAuto: boolean;
    title: string;
}

export type AxesOptions = {
    xAxis: XAxisOptions;
    yAxis: YAxisOptions;
}

export type ChartControl = {
    chart: ChartOptions;
    dimensions: DimensionOptions;
    margins: MarginOptions;
    line: LineOptions;
    markers: MarkerOptions;
    bar: BarOptions;
    axes: AxesOptions;
}

export type SetColour = {
    key: string;
    colour: string;
    colourKey: string;
}
