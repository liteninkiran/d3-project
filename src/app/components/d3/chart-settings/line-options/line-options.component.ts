import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SetColour } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-line-options',
    templateUrl: './line-options.component.html',
    styleUrls: [
        './line-options.component.scss',
        '../chart-settings.component.scss',
    ],
})
export class LineOptionsComponent {
    @Input() group: FormGroup;
    @Input() markerColour: string;

    @Output() setColourOutput = new EventEmitter<SetColour>();

    public setColour(key: string, colour: string) {
        this.setColourOutput.emit({ key, colour, colourKey: 'colour' });
    }
}
