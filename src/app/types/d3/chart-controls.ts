export type ChartType = {
    type: 'line' | 'bar';
}

export type Margin = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

export type ChartDimensions = {
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
}

export type YAxisOptions = {
    fontSize: number;
}

export type AxesOptions = {
    xAxis: XAxisOptions;
    yAxis: YAxisOptions;
}

export type ChartOptions = {
    chartType: ChartType;
    dimensions: ChartDimensions;
    margins: Margin;
    line: LineOptions;
    markers: MarkerOptions;
    bar: BarOptions;
    axes?: AxesOptions;
}

export type SetColour = {
    key: string;
    colour: string;
    colourKey: string;
}
