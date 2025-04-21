export type ChartType = 'line' | 'bar';

export type Margin = {
    top: number;
    right: number;
    bottom: number;
    left: number;
}


export type ChartControl = {
    markers: boolean;
    markerSize: number;
    chartType: ChartType;
    margins: Margin;
}

export type ChartDimensions = {
    height: number;
    width: number;
}

export type ChartSettings = {
    options: ChartControl;
    dimensions: ChartDimensions;
}

export const defaultChartOptions: ChartControl = {
    markers: false,
    markerSize: 10,
    chartType: 'line',
    margins: {
        top: 20,
        bottom: 50,
        left: 80,
        right: 30,
    }
}

export const defaultChartDimensions: ChartDimensions = {
    height: 600,
    width: 1200,
}
