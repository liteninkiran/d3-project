import { Margin, LineOptions, BarOptions, ChartOptions, ChartDimensions, ChartType, MarkerOptions, AxesOptions } from './chart-controls';

export const defaultChartType: ChartType = {
    type: 'line',
};

export const defaultChartMargins: Margin = {
    top: 20,
    bottom: 50,
    left: 100,
    right: 40,
}

export const defaultChartDimensions: ChartDimensions = {
    height: 700,
    width: 1100,
}

export const defaultLineOptions: LineOptions = {
    stroke: 1.5,
    colour: 'steelblue',
}

export const defaultMarkerOptions: MarkerOptions = {
    enabled: true,
    size: 5,
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
    },
    yAxis: {
        fontSize: 15,
        ticks: 6,
        tickFormat: ',',
        gridLines: {
            enabled: true,
        }
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
