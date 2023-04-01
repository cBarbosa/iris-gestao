import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstructionListingComponent } from './construction-listing.component';

const routes: Routes = [
	{
		path: '',
		component: ConstructionListingComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ConstructionListingRoutingModule {}
