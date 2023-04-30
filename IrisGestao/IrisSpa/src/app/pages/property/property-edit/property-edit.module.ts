import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgxMaskModule } from 'ngx-mask';
import { PropertyEditRoutingModule } from './property-edit-routing.module';
import { PropertyEditComponent } from './property-edit.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UploadListComponent } from 'src/app/shared/components/upload-list/upload-list.component';
import { TabViewModule } from 'primeng/tabview';
import { SidebarModule } from 'primeng/sidebar';

@NgModule({
	declarations: [PropertyEditComponent],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		PropertyEditRoutingModule,
		ButtonModule,
		InputTextModule,
		DropdownModule,
		FileUploadModule,
		DialogModule,
		SpinnerComponent,
		NgxMaskModule.forChild(),
		ImageCropperModule,
		UploadListComponent,
		TabViewModule,
		SidebarModule,
	],
})
export class PropertyEditModule {}
