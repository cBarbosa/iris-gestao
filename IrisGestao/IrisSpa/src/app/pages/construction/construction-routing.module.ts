import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'listing',
		loadChildren: () =>
			import('./construction-listing/construction-listing.module').then(
				(m) => m.ConstructionListingModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'details/:guid',
		loadChildren: () =>
			import('./construction-view/construction-view.module').then(
				(m) => m.ConstructionViewModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'edit/:guid',
		loadChildren: () =>
			import('./construction-edit/construction-edit.module').then(
				(m) => m.ConstructionEditModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'register',
		loadChildren: () =>
			import('./construction-register/construction-register.module').then(
				(m) => m.ConstructionRegisterModule
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
export class ConstructionRoutingModule {}
