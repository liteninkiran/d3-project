export type LineDataItem = {
    name: string;
    data: Data[];
}
export type Data = {
    x: Date;
    y: number;
}

export type ChartData = {
    date: any;
    value: number;
}

export type ChartData2 = {
    date: Date;
    value: number;
}

export type XScale = d3.ScaleTime<number, number>;
export type YScale = d3.ScaleLinear<number, number>;
export type Svg = d3.Selection<SVGSVGElement, unknown, null, undefined>;
export type Group = d3.Selection<SVGGElement, unknown, null, undefined>;
export type Div = d3.Selection<HTMLDivElement, unknown, null, undefined>;
