import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChartDimensions, Margin } from 'src/app/types/d3/chart-controls';

export type ChartOptions2 = {
    margin: Margin;
    dimensions: ChartDimensions;
}

export const defaultOptions: ChartOptions2 = {
    margin: {
        top: 100,
        right: 50,
        bottom: 50,
        left: 50
    },
    dimensions: {
        width: 1600,
        height: 600,
    },
}

@Component({
    selector: 'app-chart-settings-2',
    templateUrl: './chart-settings-2.component.html',
    styleUrls: ['./chart-settings-2.component.scss'],
})
export class ChartSettings2Component {
    public form: FormGroup;
    public chartOptions: ChartOptions2 = defaultOptions;

    @Output() public chartOptionsUpdated = new EventEmitter<ChartOptions2>();

    private subscriptions: Subscription[] = [];

    constructor(
        private fb: NonNullableFormBuilder,
    ) { }

    public ngOnInit(): void {
        this.setupForm();
        this.subscribeToForm();
    }

    public ngOnDestroy(): void {
        this.subscriptions.map((sub) => sub.unsubscribe());
    }

    private setupForm(): void {
        const margins = {
            top: this.fb.control(this.chartOptions.margin.top),
            bottom: this.fb.control(this.chartOptions.margin.bottom),
            left: this.fb.control(this.chartOptions.margin.left),
            right: this.fb.control(this.chartOptions.margin.right),
        }
        const dimensions = {
            width: this.fb.control(this.chartOptions.dimensions.width),
            height: this.fb.control(this.chartOptions.dimensions.height),
        }
        const formGroup = {
            margins: this.fb.group(margins),
            dimensions: this.fb.group(dimensions),
        }
        this.form = this.fb.group(formGroup);
    }

    private subscribeToForm() {
        const sub = this.form.valueChanges.subscribe(
            (data) => {
                this.chartOptions = {
                    margin: data.margins,
                    dimensions: {
                        width: data.dimensions.width,
                        height: data.dimensions.height,
                    },
                }
                this.chartOptionsUpdated.emit(this.chartOptions);
            }
        );
        this.subscriptions.push(sub);
    }
}
