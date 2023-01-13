import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentContractRegisterComponent } from './rent-contract-register.component';

const routes: Routes = [
	{
		path: '',
		component: RentContractRegisterComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentContractRegisterRoutingModule {}
