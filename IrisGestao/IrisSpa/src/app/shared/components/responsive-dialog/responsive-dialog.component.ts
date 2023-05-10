import {
	Component,
	EventEmitter,
	Input,
	Output,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
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
export class ResponsiveDialogComponent implements OnChanges {
	@Input()
	isMobile: boolean;

	@Input()
	visible: boolean;

	@Output()
	visibleChange = new EventEmitter<boolean>();

	@Input()
	styleClass: string;

	@Output()
	onHide = new EventEmitter<boolean>();

	hasHideEmitted = false;

	// emitVisibleChange(value: boolean) {
	// 	this.visibleChange.emit(value);
	// }

	emitOnHide(value: boolean) {
		console.log('closing');
		if (!this.hasHideEmitted) {
			this.onHide.emit(value);
			this.visibleChange.emit(false);
		}
		this.hasHideEmitted = true;
	}

	openning() {
		console.log('openning');
		this.visibleChange.emit(true);

		this.hasHideEmitted = false;
	}

	constructor(private responsiveService: ResponsiveService) {}

	OnInit() {
		console.log('init dialog');
		if (this.isMobile === undefined) {
			this.responsiveService.screenWidth$.subscribe((screenWidth) => {
				this.isMobile = screenWidth < 768;
			});
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('changes', changes);
	}
}
