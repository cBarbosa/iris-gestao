import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConstructionViewRoutingModule } from './construction-view-routing.module';
import { ConstructionViewComponent } from './construction-view.component';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { IconModule } from 'src/app/shared/components/custom-ui/icon/icon.module';
import { PanelModule } from 'primeng/panel';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PhotoGalleryComponent } from 'src/app/shared/components/photo-gallery/photo-gallery.component';
import { ProgressBarComponent } from 'src/app/shared/components/progress-bar/progress-bar.component';
import { SidebarModule } from 'primeng/sidebar';
import { DetailSidebarComponent } from 'src/app/shared/components/detail-sidebar/detail-sidebar.component';
import { IssueInvoiceSidebarComponent } from './issue-invoice-sidebar/issue-invoice-sidebar.component';
import { AttachmentListComponent } from 'src/app/shared/components/attachment-list/attachment-list.component';
import { PropertyItemModule } from 'src/app/shared/components/property-item/property-item.module';
import { UploadListComponent } from 'src/app/shared/components/upload-list/upload-list.component';

@NgModule({
	declarations: [ConstructionViewComponent],
	imports: [
		CommonModule,
		ConstructionViewRoutingModule,
		ButtonModule,
		SpinnerComponent,
		PropertyItemModule,
		IconModule,
		PanelModule,
		CardItemComponent,
		TableModule,
		TagModule,
		PhotoGalleryComponent,
		ProgressBarComponent,
		SidebarModule,
		DetailSidebarComponent,
		IssueInvoiceSidebarComponent,
		AttachmentListComponent,
		UploadListComponent,
	],
})
export class ConstructionViewModule {}
