import { Component } from '@angular/core';

@Component({
	selector: 'app-property-item',
	templateUrl: './property-item.component.html',
	styleUrls: ['./property-item.component.scss'],
})
export class PropertyItemComponent {
	randomize() {
		return Math.random() > 0.5 ? 'wallet' : 'market';
	}
}
