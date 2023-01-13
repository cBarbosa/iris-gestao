import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListingComponent } from './client-listing.component';

const routes: Routes = [
	{
		path: '',
		component: ClientListingComponent,
		// loadComponent: () =>
		// 	import('./users.component').then((m) => UsersComponent),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientListingRoutingModule {}
