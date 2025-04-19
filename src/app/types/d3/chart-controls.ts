export type ChartType = 'line' | 'bar';

export type ChartControl = {
    markers: boolean;
    markerSize: number;
    chartType: ChartType;
    chartWidth: number;
    chartHeight: number;
    margins: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }
}

export const defaultChartOptions: ChartControl = {
    markers: true,
    markerSize: 10,
    chartType: 'line',
    chartWidth: 1200,
    chartHeight: 600,
    margins: {
        top: 20,
        bottom: 50,
        left: 80,
        right: 30,
    }
}
