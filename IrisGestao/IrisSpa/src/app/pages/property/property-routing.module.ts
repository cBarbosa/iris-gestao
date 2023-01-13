import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'listing/:pageIndex',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./property-listing/property-listing.module').then(
						(m) => m.PropertyListingModule
					),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'listing',
				loadChildren: () =>
					import('./property-listing/property-listing.module').then(
						(m) => m.PropertyListingModule
					),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'details/:uid',
				loadChildren: () =>
					import('./property-view/property-view.module').then(
						(m) => m.PropertyViewModule
					),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'edit/unit/:uid',
				loadChildren: () =>
					import('./unit-edit/unit-edit.module').then((m) => m.UnitEditModule),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'edit/:uid',
				loadChildren: () =>
					import('./property-edit/property-edit.module').then(
						(m) => m.PropertyEditModule
					),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'register',
				loadChildren: () =>
					import('./property-register/property-register.module').then(
						(m) => m.PropertyRegisterModule
					),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'register/unit/:uid',
				loadChildren: () =>
					import('./unit-register/unit-register.module').then((m) => m.UnitRegisterModule),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PropertyRoutingModule {}
