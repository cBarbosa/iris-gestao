import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'listing',
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
				path: 'details/:uid',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./property-view/property-view.module').then(
						(m) => m.PropertyViewModule
					),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'edit/:uid',
				// component: PropertyListingComponent,
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
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./property-register/property-register.module').then(
						(m) => m.PropertyRegisterModule
					),
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
