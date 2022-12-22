import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';

type ImageData = {
	url: string;
	thumbUrl: string;
	alt?: string;
};

@Component({
	standalone: true,
	selector: 'app-photo-gallery',
	imports: [CommonModule, DialogModule],
	templateUrl: './photo-gallery.component.html',
	styleUrls: ['./photo-gallery.component.scss'],
})
export class PhotoGalleryComponent {
	@Input()
	imageList: ImageData[];

	displayModal = false;

	selectedImage: ImageData;

	ngOnInit() {
		console.log(this.imageList);
	}

	showImageModal(img: ImageData) {
		this.selectedImage = img;
		this.displayModal = true;
	}

	closeImageModal() {
		this.displayModal = false;
	}
}
