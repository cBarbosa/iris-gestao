import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { ResponsiveService } from '../../services/responsive-service.service';

@Component({
	selector: 'app-responsive-dialog',
	standalone: true,
	imports: [CommonModule, DialogModule, SidebarModule],
	templateUrl: './responsive-dialog.component.html',
	styleUrls: ['./responsive-dialog.component.scss'],
})
export class ResponsiveDialogComponent {
	@Input()
	isMobile: boolean;

	@Input()
	visible: boolean;

	@Output()
	visibleChange = new EventEmitter<boolean>();

	@Input()
	styleClass: string;

	@Input()
	onHide: Function;

	emitVisibleChange(value: boolean) {
		this.visibleChange.emit(value);
	}

	constructor(private responsiveService: ResponsiveService) {}

	OnInit() {
		if (this.isMobile === undefined) {
			this.responsiveService.screenWidth$.subscribe((screenWidth) => {
				this.isMobile = screenWidth < 768;
			});
		}
	}
}
