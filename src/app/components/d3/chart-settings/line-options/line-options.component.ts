import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-line-options',
    templateUrl: './line-options.component.html',
    styleUrls: ['./line-options.component.scss'],
})
export class LineOptionsComponent {
    @Input() group: FormGroup;
    @Input() markerColour: string;
    @Input() setColour: (key: string, colour: string) => void;
}
