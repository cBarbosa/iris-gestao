import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRoutes } from './auth/auth-routing.module';
import { HomeComponent } from './home/home.component';
import { PropertyListingComponent } from './pages/property/property-listing/property-listing.component';
import { PropertyItemComponent } from './shared/components/property-item/property-item.component';
import { AuthGuard } from './shared/helpers/auth/auth.guard';
import { LoggedInLayoutComponent } from './layout/logged-in/logged-in-layout.component';
import { LoggedInLayoutModule } from './layout/logged-in/logged-in-layout.module';

const routes: Routes = [
	{
		path: '',
		component: LoggedInLayoutComponent,
		children: [
			{
				path: 'property/listing',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import(
						'./pages/property/property-listing/property-listing.module'
					).then((m) => m.PropertyListingModule),
				// canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'property/details/:uid',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/property/property-view/property-view.module').then(
						(m) => m.PropertyViewModule
					),
				// canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'property/edit',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/property/property-edit/property-edit.module').then(
						(m) => m.PropertyEditModule
					),
				// canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'client/listing',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/client/client-listing/client-listing.module').then(
						(m) => m.ClientListingModule
					),
				// canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'client/details',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/client/client-view/client-view.module').then(
						(m) => m.ClientViewModule
					),
				// canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'client/register',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/client/client-register/client-register.module').then(
						(m) => m.ClientRegisterModule
					),
				// canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
		],
	},
	{
		path: 'home',
		component: HomeComponent,
		// canActivate: [AuthGuard],
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	...LoginRoutes,
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
	],
	exports: [RouterModule],
})
export class AppRoutingModule {}
