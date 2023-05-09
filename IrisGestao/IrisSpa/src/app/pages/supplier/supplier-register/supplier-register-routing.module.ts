import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierRegisterComponent } from './supplier-register.component';

const routes: Routes = [
	{
		path: '',
		component: SupplierRegisterComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRegisterRoutingModule { }
