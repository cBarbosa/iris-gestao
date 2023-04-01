import { Component, Input, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-detail-sidebar',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './detail-sidebar.component.html',
	styleUrls: ['./detail-sidebar.component.scss'],
})
export class DetailSidebarComponent {
	@Input()
	data: {
		label: string;
		data: any;
		span?: boolean;
		pipe?: PipeTransform;
	}[];
}
