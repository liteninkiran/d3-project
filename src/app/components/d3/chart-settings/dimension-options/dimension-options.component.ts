import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-dimension-options',
    templateUrl: './dimension-options.component.html',
    styleUrls: [
        './dimension-options.component.scss',
        '../chart-settings.component.scss',
    ],
})
export class DimensionOptionsComponent {
    @Input() dimensionGroup: FormGroup;
    @Input() marginGroup: FormGroup;
    @Input() maxWidth: number;
    @Input() maxHeight: number;
}
