import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportCostsComponent } from './report-costs.component';

const routes: Routes = [
  {
		path: '',
		component: ReportCostsComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportCostsRoutingModule { }
