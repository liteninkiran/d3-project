import { Margin, LineOptions, BarOptions, ChartOptions, ChartDimensions, ChartType, MarkerOptions } from './chart-controls';

export const defaultChartType: ChartType = 'line';

export const defaultChartMargins: Margin = {
    top: 20,
    bottom: 80,
    left: 80,
    right: 20,
}

export const defaultChartDimensions: ChartDimensions = {
    height: 700,
    width: 1500,
}

export const defaultLineOptions: LineOptions = {
    stroke: 0.5,
    colour: 'steelblue',
}

export const defaultMarkerOptions: MarkerOptions = {
    enabled: true,
    size: 2,
    colour: 'steelblue',
}

export const defaultBarOptions: BarOptions = {
    width: 2.5,
}

export const defaultChartOptions: ChartOptions = {
    chartType: defaultChartType,
    margins: defaultChartMargins,
    dimensions: defaultChartDimensions,
    line: defaultLineOptions,
    markers: defaultMarkerOptions,
    bar: defaultBarOptions,
}
