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
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
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
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
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
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class SupplierRoutingModule {}
