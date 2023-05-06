import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export type Step = {
	label: string;
	isValid?: boolean;
	isCurrent?: boolean;
	isVisited?: boolean;
};

@Component({
	standalone: true,
	imports: [CommonModule],
	selector: 'app-form-steps',
	templateUrl: './form-steps.component.html',
	styleUrls: ['./form-steps.component.scss'],
})
export class FormStepsComponent {
	@Input()
	list: Step[];

	@Input()
	callback: ((step: number) => any) | null = null;

	ngOnInit() {}
}
