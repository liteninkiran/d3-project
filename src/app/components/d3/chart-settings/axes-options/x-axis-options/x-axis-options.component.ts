import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-x-axis-options',
    templateUrl: './x-axis-options.component.html',
    styleUrls: [
        './x-axis-options.component.scss',
        '../../chart-settings.component.scss',
    ],
})
export class XAxisOptionsComponent {
    @Input() group: FormGroup;
}
