import { DatePipe, DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { ChartContext } from 'src/app/types/d3/services';
import { ChartData } from 'src/app/types/d3/data';
import * as d3 from 'd3';

@Injectable({ providedIn: 'root' })
export class TooltipService {

    private context: ChartContext;

    constructor(
        private decimalPipe: DecimalPipe,
        private datePipe: DatePipe,
    ) { }

    public setContext(context: ChartContext): void {
        this.context = context;
    }

    public addTooltip() {
        const { x, y, data, getLayer, chartOptions, innerHeight, innerWidth } = this.context;
        const tooltipLayer = getLayer('tooltip-layer');

        let tooltip = d3.select('body').select('.tooltip');

        if (tooltip.empty()) {
            tooltip = d3.select('body')
                .append('div')
                .attr('class', 'tooltip')
                .style('position', 'absolute')
                .style('padding', '10px')
                .style('background-color', 'steelblue')
                .style('color', 'white')
                .style('border', '1px solid white')
                .style('border-radius', '10px')
                .style('display', 'none')
                .style('z-index', 5)
                .style('pointer-events', 'none');
        }

        // Clear previous tooltipLayer elements to avoid duplicates
        tooltipLayer.selectAll('*').remove();

        // Add a circle element
        const circle = tooltipLayer
            .append('circle')
            .attr('r', 0)
            .attr('fill', 'steelblue')
            .style('stroke', 'white')
            .attr('opacity', .70)
            .style('pointer-events', 'none');

        // Create a listening rectangle
        const listeningRect = tooltipLayer
            .append('rect')
            .attr('width', innerWidth - 1)
            .attr('height', innerHeight)
            .style('pointer-events', 'all')
            .style('fill-opacity', 0)
            .style('stroke-opacity', 0)
            .style('z-index', 1);

        const mousemoveFn = (event: MouseEvent) => {
            // Find the closest data item
            const dAttribute = (event: MouseEvent) => {
                const rect = tooltipLayer.select('rect').node();
                const [xCoord] = d3.pointer(event, rect);
                const bisectDate = d3.bisector<ChartData, Date>(d => d.date).left;
                const x0 = x.invert(xCoord);
                const i = bisectDate(data, x0, 1);
                const d0 = data[i - 1];
                const d1 = data[i];
                const diff0 = x0.valueOf() - d0.date.valueOf();
                const diff1 = d1.date.valueOf() - x0.valueOf();
                return diff0 > diff1 ? d1 : d0;
            }

            // Store the closest data item
            const dataItem = dAttribute(event);

            // Calculate x, y positions
            const xPos = x(dataItem.date);
            const yPos = y(dataItem.value);

            // Update the circle position
            circle.attr('cx', xPos).attr('cy', yPos);

            // Add transition for the circle radius
            circle.transition().duration(50).attr('r', 5);

            const htmlLines = [
                `<strong>DATE:</strong> ${this.datePipe.transform(dataItem.date, 'd LLLL y')}`,
                `<strong>VALUE:</strong> ${this.decimalPipe.transform(dataItem.value)}`,
            ];

            // Add in our tooltip
            tooltip.style('display', 'block')
                .style('left', `${xPos + 130}px`)
                .style('top', `${yPos + 70}px`)
                .html(htmlLines.join('<br>'));
        }

        const mouseleaveFn = () => {
            circle.transition().duration(50).attr('r', 0);
            tooltip.style('display', 'none');
        }

        listeningRect.on('mousemove', mousemoveFn);
        listeningRect.on('mouseleave', mouseleaveFn);
    }

    public removeTooltip(): void {
        d3.select('body').select('.tooltip').remove();
    }
}
