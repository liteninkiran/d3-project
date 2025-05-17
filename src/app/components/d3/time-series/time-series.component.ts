// Angular Imports
import { Component, OnInit, Input, ElementRef, AfterViewInit, ViewChild, ChangeDetectionStrategy, SimpleChanges, OnChanges } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

// Local Imports
import { ChartData } from 'src/app/types/d3/data';
import { BarChartRendererService } from 'src/app/services/d3/bar-chart-renderer.service';
import { LineChartRendererService } from 'src/app/services/d3/line-chart-renderer.service';
import { TimeChartBaseService } from 'src/app/services/d3/time-chart-base.service';
import { ChartControl } from 'src/app/types/d3/chart-controls';
import { TooltipService } from 'src/app/services/d3/tooltip.service';
import { ChartSettingsComponent } from '../chart-settings/chart-settings.component';
import { defaultChartOptions } from 'src/app/types/d3/chart-control-defaults';

@Component({
    selector: 'app-time-series',
    templateUrl: './time-series.component.html',
    styleUrls: ['./time-series.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSeriesComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() public data: ChartData[] = [];

    public chartControl: ChartControl = defaultChartOptions;

    @ViewChild('divRef', { static: true }) private divRef: ElementRef<HTMLDivElement>;

    private subscriptions: Subscription[] = [];

    constructor(
        private baseService: TimeChartBaseService,
        private lineChartService: LineChartRendererService,
        private barChartService: BarChartRendererService,
        private tooltipService: TooltipService,
        private dialog: MatDialog,
    ) { }

    public ngOnInit(): void { }

    public ngAfterViewInit(): void { }

    public ngOnChanges(_changes: SimpleChanges): void {
        this.createChart();
    }

    public ngOnDestroy(): void {
        this.tooltipService.removeTooltip();
        this.baseService.reset();
    }

    private createChart(): void {
        if (!this.divRef?.nativeElement || this.data.length === 0) return;

        this.baseService.init(
            this.divRef.nativeElement,
            this.data,
            this.chartControl,
        );
        const context = this.baseService.getContext();

        this.lineChartService.setContext(context);
        this.barChartService.setContext(context);
        this.tooltipService.setContext(context);

        if (this.chartControl.chart.type === 'line') {
            this.barChartService.removeBars();
            this.lineChartService.draw();
        } else {
            this.lineChartService.removeLineAndMarkers();
            this.barChartService.drawBar();
        }

        this.tooltipService.addTooltip();
    }

    public openChartSettingsModal() {
        const dialogConfig = new MatDialogConfig<ChartControl>();
        dialogConfig.data = this.chartControl;
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        const dialogRef = this.dialog.open(ChartSettingsComponent, dialogConfig);
        const dialogOpen = dialogRef.afterOpened();

        const formChangedFn = (data?: ChartControl) => {
            if (data) {
                this.chartControl = data;
                this.createChart();
            }
        }
        const dialogOpenFn = () => this.subscribeTo(dialogRef.componentInstance.form.valueChanges, formChangedFn);

        this.subscribeTo(dialogOpen, dialogOpenFn);
    }

    private subscribeTo(obs: Observable<any>, fn: () => void): void {
        const sub = obs.subscribe(fn);
        this.subscriptions.push(sub);
    }
}
