import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseListingComponent } from './expense-listing.component';

const routes: Routes = [
	{
		path: '',
		component: ExpenseListingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ExpenseListingRoutingModule {}
