import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';

const routes: Routes = [
	{
		path: 'listing',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./supplier-listing/supplier-listing.module').then(
				(m) => m.SupplierListingModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'details/:uid',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./supplier-view/supplier-view.module').then(
				(m) => m.SupplierViewModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'register/:uid',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./supplier-register/supplier-register.module').then(
				(m) => m.SupplierRegisterModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupplierRoutingModule {}
