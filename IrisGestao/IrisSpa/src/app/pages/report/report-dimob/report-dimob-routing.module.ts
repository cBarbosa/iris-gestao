import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportDimobComponent } from './report-dimob.component';

const routes: Routes = [
  {
    path: '',
    component: ReportDimobComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportDimobRoutingModule { }
