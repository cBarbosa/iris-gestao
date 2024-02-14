import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/helpers/auth/auth.guard';

const routes: Routes = [
	{
		path: 'listing',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./client-listing/client-listing.module').then(
				(m) => m.ClientListingModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'details/:uid',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./client-view/client-view.module').then(
				(m) => m.ClientViewModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'register/:uid',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./client-register/client-register.module').then(
				(m) => m.ClientRegisterModule
			),
		canActivate: [AuthGuard],
		data: {
			role: 'COMERCIAL, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'register/:uid/Clone',
		// component: PropertyListingComponent,
		loadChildren: () =>
			import('./client-register/client-register.module').then(
				(m) => m.ClientRegisterModule
			),
		canActivate: [AuthGuard],
		data: {
			role: 'COMERCIAL, COORDENAÇÃO, DIRETORIA',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ClientRoutingModule {}
