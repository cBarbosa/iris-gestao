import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'listing',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./client-listing/client-listing.module').then(
				(m) => m.ClientListingModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'details',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./client-view/client-view.module').then(
				(m) => m.ClientViewModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'register',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./client-register/client-register.module').then(
				(m) => m.ClientRegisterModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientRoutingModule {}
