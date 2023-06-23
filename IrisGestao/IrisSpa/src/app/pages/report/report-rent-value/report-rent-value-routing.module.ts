import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportRentValueComponent } from './report-rent-value.component';

const routes: Routes = [
	{
		path: '',
		component: ReportRentValueComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ReportRentValueRoutingModule {}
