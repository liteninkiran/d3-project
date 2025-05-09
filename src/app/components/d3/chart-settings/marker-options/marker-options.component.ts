import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SetColour } from 'src/app/types/d3/chart-controls';

@Component({
    selector: 'app-marker-options',
    templateUrl: './marker-options.component.html',
    styleUrls: ['./marker-options.component.scss', '../chart-settings.component.scss'],
})
export class MarkerOptionsComponent {
    @Input() group: FormGroup;
    @Input() lineColour: string;

    @Output() setColourOutput = new EventEmitter<SetColour>();

    public setColour(key: string, colour: string) {
        console.log(key, colour);
        this.setColourOutput.emit({ key, colour });
    }
}
