import { Margin, LineOptions, BarOptions, ChartOptions, ChartDimensions, ChartType, MarkerOptions, AxesOptions } from './chart-controls';

export const defaultChartType: ChartType = {
    type: 'line',
};

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
    stroke: 0.5,
    strokeColour: 'steelblue',
    strokeOpacity: 1,
    colour: 'steelblue',
    opacity: 1,
}

export const defaultBarOptions: BarOptions = {
    width: 2.5,
    colour: 'tomato',
}

export const defaultAxesOptions: AxesOptions = {
    xAxis: {
        fontSize: 10,
        rotation: 0,
        textAnchor: 'middle',
    },
    yAxis: {
        fontSize: 10,
    },
}

export const defaultChartOptions: ChartOptions = {
    chartType: defaultChartType,
    margins: defaultChartMargins,
    dimensions: defaultChartDimensions,
    line: defaultLineOptions,
    markers: defaultMarkerOptions,
    bar: defaultBarOptions,
    axes: defaultAxesOptions,
}
