import * as d3 from 'd3';
import { ChartData } from 'src/app/types/d3/data';

export function createXAxis(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    xScale: d3.ScaleTime<number, number, never>,
    chartWidth: number,
    chartHeight: number,
    xAxisLabel: string
) {
    const xAxis = d3.axisBottom(xScale)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d3.timeFormat('%d/%m/%Y'));

    g.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    g.append('text')
        .attr('class', 'x-axis-label')
        .attr('transform', `translate(${chartWidth / 2}, ${chartHeight + 40})`)
        .style('text-anchor', 'middle')
        .text(xAxisLabel);
}

export function createYAxis(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    yScale: d3.ScaleContinuousNumeric<number, number, never>,
    chartHeight: number,
    yAxisLabel: string
) {
    g.append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale));

    g.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -60)
        .attr('x', -chartHeight / 2)
        .style('text-anchor', 'middle')
        .text(yAxisLabel);
}

export function createLine(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: ChartData[],
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleContinuousNumeric<number, number, never>,
    showMarkers: boolean
): void {
    const line = d3.line<ChartData>()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value));

    // Draw the line
    g.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', line)
        .style('stroke', 'steelblue')
        .style('fill', 'none')
        .style('stroke-width', 2);

    // Draw markers
    if (showMarkers) {
        drawMarkers(g, data, xScale, yScale);
    }
}

function drawMarkers(
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    data: ChartData[],
    xScale: d3.ScaleTime<number, number, never>,
    yScale: d3.ScaleContinuousNumeric<number, number, never>
) {
    const markers = g.selectAll('.marker')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'marker')
        .attr('cx', (d: ChartData) => xScale(d.date))
        .attr('cy', (d: ChartData) => yScale(d.value))
        .attr('r', 4)
        .attr('fill', 'steelblue')
        .attr('stroke', 'white')
        .attr('stroke-width', 0)
        .style('cursor', 'pointer');

    markers.on('mouseover', function (event: MouseEvent, d: ChartData) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 8);
    });

    markers.on('mouseout', function (event: MouseEvent) {
        d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 4);
    });
}
