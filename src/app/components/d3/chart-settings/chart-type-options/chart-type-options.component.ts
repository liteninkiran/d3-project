import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-chart-type-options',
    templateUrl: './chart-type-options.component.html',
    styleUrls: [
        './chart-type-options.component.scss',
        '../chart-settings.component.scss',
    ],
})
export class ChartTypeOptionsComponent {
    @Input() group: FormGroup;

    public onRadioClick(event: Event): void {
        const el = event.target as HTMLOptionElement;
        el.blur();
    }
}
