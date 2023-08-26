import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/helpers/auth/auth.guard';

const routes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'carteira/listing/:pageIndex',
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
				path: 'mercado/listing/:pageIndex',
				loadChildren: () =>
					import('./property-listing/property-listing.module').then(
						(m) => m.PropertyListingModule
					),
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'carteira/listing',
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
				path: 'mercado/listing',
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
				canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR',
				},
			},
			{
				path: 'edit/:uid',
				loadChildren: () =>
					import('./property-edit/property-edit.module').then(
						(m) => m.PropertyEditModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR',
				},
			},
			{
				path: 'carteira/register',
				loadChildren: () =>
					import('./property-register/property-register.module').then(
						(m) => m.PropertyRegisterModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR',
				},
			},
			{
				path: 'mercado/register',
				loadChildren: () =>
					import('./property-register/property-register.module').then(
						(m) => m.PropertyRegisterModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR',
				},
			},
			{
				path: 'register/unit/:uid',
				loadChildren: () =>
					import('./unit-register/unit-register.module').then(
						(m) => m.UnitRegisterModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR',
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
