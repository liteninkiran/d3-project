import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-scratch2',
    templateUrl: './scratch2.component.html',
    styleUrls: ['./scratch2.component.scss'],
})
export class Scratch2Component {
    public form: FormGroup;
    public margin = { top: 100, right: 50, bottom: 50, left: 50 }
    public width = 1600;
    public height = 600;

    constructor(
        private fb: NonNullableFormBuilder,
    ) { }

    public ngOnInit(): void {
        this.setupForm();
    }

    private setupForm(): void {
        const margins = {
            top: this.fb.control(this.margin.top),
            bottom: this.fb.control(this.margin.bottom),
            left: this.fb.control(this.margin.left),
            right: this.fb.control(this.margin.right),
        }
        const dimensions = {
            width: this.fb.control(this.width),
            height: this.fb.control(this.height),
        }
        const formGroup = {
            margins: this.fb.group(margins),
            dimensions: this.fb.group(dimensions),
        }
        this.form = this.fb.group(formGroup);
        const sub = this.form.valueChanges.subscribe(
            (data) => {
                this.margin = data.margins;
                this.width = data.dimensions.width;
                this.height = data.dimensions.height;
            }
        );
    }
}
