import { MarginOptions, LineOptions, BarOptions, ChartControl, DimensionOptions, ChartOptions, MarkerOptions, AxesOptions } from './chart-controls';

export const defaultChartType: ChartOptions = {
    type: 'line',
    title: 'Chart Title',
};

export const defaultChartMargins: MarginOptions = {
    top: 20,
    bottom: 50,
    left: 100,
    right: 40,
}

export const defaultChartDimensions: DimensionOptions = {
    height: 700,
    width: 1700,
}

export const defaultLineOptions: LineOptions = {
    stroke: 1.5,
    colour: 'steelblue',
}

export const defaultMarkerOptions: MarkerOptions = {
    enabled: false,
    size: 3,
    stroke: 0.5,
    strokeColour: 'black',
    strokeOpacity: 1,
    colour: 'red',
    opacity: 0.35,
}

export const defaultBarOptions: BarOptions = {
    width: 2.5,
    colour: 'tomato',
}

export const defaultAxesOptions: AxesOptions = {
    xAxis: {
        fontSize: 15,
        rotation: 0,
        textAnchor: 'middle',
        dateFormat: '%b %Y',
        baseUnit: 'month',
        every: 6,
        title: 'X Axis Title',
    },
    yAxis: {
        fontSize: 15,
        ticks: 6,
        tickFormat: ',',
        gridLines: {
            enabled: true,
        },
        min: 0,
        max: 0,
        minAuto: true,
        maxAuto: true,
        title: 'Y Axis Title',
    },
}

export const defaultChartOptions: ChartControl = {
    chart: defaultChartType,
    margins: defaultChartMargins,
    dimensions: defaultChartDimensions,
    line: defaultLineOptions,
    markers: defaultMarkerOptions,
    bar: defaultBarOptions,
    axes: defaultAxesOptions,
}
