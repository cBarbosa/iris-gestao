import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpenseViewRoutingModule } from './expense-view-routing.module';
import { ExpenseViewComponent } from './expense-view.component';
import { SpinnerComponent } from 'src/app/shared/components/custom-ui/spinner/spinner.component';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardItemComponent } from 'src/app/shared/components/card-item/card-item.component';
import { PropertyListComponent } from 'src/app/shared/components/property-list/property-list.component';
import { SidebarModule } from 'primeng/sidebar';
import { DetailSidebarComponent } from 'src/app/shared/components/detail-sidebar/detail-sidebar.component';
import { UploadListComponent } from 'src/app/shared/components/upload-list/upload-list.component';
import { BaixaTituloSidebarComponent } from './baixa-titulo-sidebar/baixa-titulo-sidebar.component';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
	declarations: [ExpenseViewComponent],
	imports: [
		CommonModule,
		ExpenseViewRoutingModule,
		SpinnerComponent,
		PanelModule,
		TableModule,
		TagModule,
		ButtonModule,
		CardItemComponent,
		PropertyListComponent,
		SidebarModule,
		DetailSidebarComponent,
		UploadListComponent,
		BaixaTituloSidebarComponent,
	],
})
export class ExpenseViewModule {}
