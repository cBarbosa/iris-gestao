import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentContractEditComponent } from './rent-contract-edit.component';

const routes: Routes = [
	{
		path: '',
		component: RentContractEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentContractEditRoutingModule {}
