import { Component } from '@angular/core';

@Component({
    selector: 'app-chart-type-options',
    templateUrl: './chart-type-options.component.html',
    styleUrls: [
        './chart-type-options.component.scss',
        '../chart-settings.component.scss',
    ],
})
export class ChartTypeOptionsComponent {
    public onRadioClick(event: Event): void {
        const el = event.target as HTMLOptionElement;
        el.blur();
    }
}
