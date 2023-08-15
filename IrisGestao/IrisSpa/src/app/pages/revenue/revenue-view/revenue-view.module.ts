import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevenueViewRoutingModule } from './revenue-view-routing.module';
import { RevenueViewComponent } from './revenue-view.component';
import { ButtonModule } from 'primeng/button';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { PropertyListComponent } from 'src/app/shared/components/property-list/property-list.component';
import { IconModule } from 'src/app/shared/components/custom-ui/icon/icon.module';
import { PanelModule } from 'primeng/panel';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { PhotoGalleryComponent } from 'src/app/shared/components/photo-gallery/photo-gallery.component';
import { SidebarModule } from 'primeng/sidebar';
import { DetailSidebarComponent } from 'src/app/shared/components/detail-sidebar/detail-sidebar.component';
import { BaixaTituloSidebarComponent } from './baixa-titulo-sidebar/baixa-titulo-sidebar.component';
import { UploadListComponent } from 'src/app/shared/components/upload-list/upload-list.component';
import { EdicaoTituloSidebarComponent } from '../../revenue/revenue-view/edicao-titulo-sidebar/edicao-titulo-sidebar.component';
import { AdicionarTituloSidebarComponent } from '../../revenue/revenue-view/add-titulo-sidebar/add-titulo-sidebar.component';
import { SidebarAddFaturaComponent } from 'src/app/shared/components/sidebar-add-fatura/sidebar-add-fatura.component';

@NgModule({
	declarations: [RevenueViewComponent],
	imports: [
		CommonModule,
		RevenueViewRoutingModule,
		ButtonModule,
		SpinnerComponent,
		PropertyListComponent,
		IconModule,
		PanelModule,
		CardItemComponent,
		TableModule,
		TagModule,
		PhotoGalleryComponent,
		SidebarModule,
		DetailSidebarComponent,
		BaixaTituloSidebarComponent,
		EdicaoTituloSidebarComponent,
		AdicionarTituloSidebarComponent,
		UploadListComponent,
		SidebarAddFaturaComponent,
	],
})
export class RevenueViewModule {}
