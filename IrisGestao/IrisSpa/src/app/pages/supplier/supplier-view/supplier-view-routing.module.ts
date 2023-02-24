import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierViewComponent } from './supplier-view.component';

const routes: Routes = [
	{
		path: '',
		component: SupplierViewComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierViewRoutingModule { }
