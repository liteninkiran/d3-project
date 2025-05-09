import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SetColour } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-bar-options',
    templateUrl: './bar-options.component.html',
    styleUrls: [
        './bar-options.component.scss',
        '../chart-settings.component.scss',
    ],
})
export class BarOptionsComponent {
    @Input() group: FormGroup;
    @Input() lineColour: string;

    @Output() setColourOutput = new EventEmitter<SetColour>();

    public setColour(key: string, colour: string) {
        this.setColourOutput.emit({ key, colour, colourKey: 'colour' });
    }
}
