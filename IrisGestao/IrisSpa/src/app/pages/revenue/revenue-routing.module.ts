import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'listing',
		loadChildren: () =>
			import('./revenue-listing/revenue-listing.module').then(
				(m) => m.RevenueListingModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'details/:guid',
		loadChildren: () =>
			import('./revenue-view/revenue-view.module').then(
				(m) => m.RevenueViewModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'edit/:guid',
		loadChildren: () =>
			import('./revenue-edit/revenue-edit.module').then(
				(m) => m.RevenueEditModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'register',
		loadChildren: () =>
			import('./revenue-register/revenue-register.module').then(
				(m) => m.RevenueRegisterModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RevenueRoutingModule {}
