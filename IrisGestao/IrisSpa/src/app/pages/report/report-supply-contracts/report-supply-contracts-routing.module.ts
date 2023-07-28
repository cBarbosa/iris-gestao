import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportSupplyContractsComponent } from './report-supply-contracts.component';

const routes: Routes = [
  {
		path: '',
		component: ReportSupplyContractsComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportSupplyContractsRoutingModule { }
