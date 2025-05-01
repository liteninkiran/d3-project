import { Margin, LineOptions, BarOptions, ChartOptions, ChartDimensions, ChartType, ChartSettings } from './chart-controls';

export const defaultChartType: ChartType = 'line';

export const defaultChartMargins: Margin = {
    top: 20,
    bottom: 80,
    left: 80,
    right: 20,
}

export const defaultLineOptions: LineOptions = {
    stroke: 1,
}

export const defaultBarOptions: BarOptions = {
    width: 10,
}

export const defaultChartOptions: ChartOptions = {
    markers: false,
    markerSize: 10,
    chartType: defaultChartType,
    margins: defaultChartMargins,
    line: defaultLineOptions,
    bar: defaultBarOptions,
}

export const defaultChartDimensions: ChartDimensions = {
    height: 700,
    width: 1500,
}

export const defaultChartSettings: ChartSettings = {
    options: defaultChartOptions,
    dimensions: defaultChartDimensions,
}
