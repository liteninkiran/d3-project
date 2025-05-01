export type ChartType = 'line' | 'bar';

export type Margin = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export type LineOptions = {
    stroke: number;
}

export type BarOptions = {
    width: number;
}

export type ChartOptions = {
    markers: boolean;
    markerSize: number;
    chartType: ChartType;
    margins: Margin;
    line: LineOptions;
    bar: BarOptions;
}

export type ChartDimensions = {
    height: number;
    width: number;
}

export type ChartSettings = {
    options: ChartOptions;
    dimensions: ChartDimensions;
}
