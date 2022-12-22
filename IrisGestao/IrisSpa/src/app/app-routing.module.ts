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
				path: 'property',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/property/property.module').then(
						(m) => m.PropertyModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'client',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/client/client.module').then((m) => m.ClientModule),
				canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: 'home',
				// component: HomeComponent,
				loadChildren: () =>
					import('./pages/home/home.module').then((m) => m.HomeModule),
				canActivate: [AuthGuard],
				data: {
					role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
				},
			},
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full',
			},
		],
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
