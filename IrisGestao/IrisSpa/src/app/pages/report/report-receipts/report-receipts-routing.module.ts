import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportReceiptsComponent } from './report-receipts.component';

const routes: Routes = [
  {
    path: '',
    component: ReportReceiptsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportReceiptsRoutingModule { }
