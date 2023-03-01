import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentContractViewComponent } from './rent-contract-view.component';

const routes: Routes = [
	{
		path: '',
		component: RentContractViewComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RentContractViewRoutingModule {}
