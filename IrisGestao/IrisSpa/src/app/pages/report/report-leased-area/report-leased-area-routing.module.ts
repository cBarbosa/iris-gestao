import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportLeasedAreaComponent } from './report-leased-area.component';

const routes: Routes = [
	{
		path: '',
		component: ReportLeasedAreaComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ReportLeasedAreaRoutingModule {}
