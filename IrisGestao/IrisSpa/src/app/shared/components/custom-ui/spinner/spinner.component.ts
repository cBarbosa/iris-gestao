import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-spinner',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
	@Input()
	text: string;

	@Input()
	styleClass: string;

	@Input()
	onlyIcon: boolean;
}
