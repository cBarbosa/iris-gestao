import { Component, Input, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';

@Component({
	selector: 'app-card-item',
	standalone: true,
	imports: [CommonModule, TagModule, ButtonModule],
	templateUrl: './card-item.component.html',
	styleUrls: ['./card-item.component.scss'],
})
export class CardItemComponent {
	@Input()
	card: {
		header?: {
			title: string;
			hasMenu?: boolean;
		};
		infos: {
			label: string;
			data: any;
			pipe?: PipeTransform;
		}[];
		tags?: {
			value: string;
			severity: string;
		}[];
	};
}
