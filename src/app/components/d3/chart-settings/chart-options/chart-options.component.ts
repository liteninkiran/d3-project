import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-chart-options',
    templateUrl: './chart-options.component.html',
    styleUrls: [
        './chart-options.component.scss',
        '../chart-settings.component.scss',
    ],
})
export class ChartOptionsComponent {
    @Input() group: FormGroup;

    public onRadioClick(event: Event): void {
        const el = event.target as HTMLOptionElement;
        el.blur();
    }
}
