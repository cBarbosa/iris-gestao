import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-pill-tab',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './pill-tab.component.html',
	styleUrls: ['./pill-tab.component.scss'],
})
export class PillTabComponent {
	@Input()
	labels: string[];

	@Input()
	current: number;

	@Input()
	styleClass: string = '';

	@Output()
	onTabChange = new EventEmitter<number>();

	ngOnInit() {
		if (this.labels === undefined)
			throw Error("Missing 'labels' attribute on PillTab component");
	}

	changeTab(i: number) {
		this.onTabChange.emit(i);
	}
}
