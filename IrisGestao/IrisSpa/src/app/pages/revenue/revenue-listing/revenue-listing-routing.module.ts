import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevenueListingComponent } from './revenue-listing.component';

const routes: Routes = [
	{
		path: '',
		component: RevenueListingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RevenueListingRoutingModule {}
