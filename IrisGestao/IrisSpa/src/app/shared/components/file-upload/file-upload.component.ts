import {
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { Utils } from '../../utils';
import { ResponsiveService } from '../../services/responsive-service.service';

@Component({
	selector: 'app-file-upload',
	standalone: true,
	imports: [CommonModule, FileUploadModule],
	templateUrl: './file-upload.component.html',
	styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
	@Input()
	name: string;

	@Input()
	multiple: boolean = true;

	@Input()
	accept: string;

	@Input()
	disabled: boolean;

	@Input()
	maxFileSize: number = 1000000;

	@Input()
	fileLimit: number;

	@ViewChild('fileUpload') fileUpload: any;

	@Output() selectEvent = new EventEmitter<File[]>();

	selectedAttachments: File[] = [];
	// selectedAttachments = [
	// 	{ name: 'teste', size: 109303 },
	// 	{
	// 		name: 'teste nome test name doc teste nome test name doc teste nome test name doc',
	// 		size: 109303,
	// 	},
	// 	{ name: 'teste nome test', size: 2109303 },
	// 	{ name: 'teste nome test name doc', size: 109303 },
	// ];

	limitReached = false;

	isMobile: boolean;

	constructor(private responsiveService: ResponsiveService) {}

	onInit() {
		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth <= 768;
		});
	}

	onSelect(e: { originalEvent: Event; files: File[]; currentFiles: File[] }) {
		console.log('select event', e);

		for (let i = 0; i < e.files.length; i++) {
			if (this.selectedAttachments.length < this.fileLimit)
				this.selectedAttachments.push(e.files[i]);
			if (this.selectedAttachments.length >= this.fileLimit) {
				this.limitReached = true;
				break;
			}
		}

		this.fileUpload.clear();

		this.selectEvent.emit(this.selectedAttachments);
	}

	removeAttachment(index: number) {
		this.selectedAttachments.splice(index, 1);

		if (this.selectedAttachments.length < this.fileLimit)
			this.limitReached = false;

		this.selectEvent.emit(this.selectedAttachments);
	}

	humanFileSize(size: number) {
		return Utils.humanFileSize(size);
	}
}
