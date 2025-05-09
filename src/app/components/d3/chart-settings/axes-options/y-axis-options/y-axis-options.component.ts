import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-y-axis-options',
    templateUrl: './y-axis-options.component.html',
    styleUrls: [
        './y-axis-options.component.scss',
        '../../chart-settings.component.scss',
    ],
})
export class YAxisOptionsComponent {
    @Input() group: FormGroup;

    get gridLinesGroup() {
        return this.group.get('gridLines') as FormGroup;
    }
}
