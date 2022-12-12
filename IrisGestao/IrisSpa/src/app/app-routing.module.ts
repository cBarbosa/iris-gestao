import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRoutes } from './auth/auth-routing.module';
import { HomeComponent } from './home/home.component';
import { PropertyListingComponent } from './pages/property-listing/property-listing.component';
import { PropertyItemComponent } from './pages/property-listing/property-item/property-item.component';
import { AuthGuard } from './shared/helpers/auth/auth.guard';
import { LoggedInLayoutComponent } from './layout/logged-in/logged-in-layout.component';
import { LoggedInLayoutModule } from './layout/logged-in/logged-in-layout.module';

const routes: Routes = [
	{
		path: '',
		component: LoggedInLayoutComponent,
		children: [
			{
				path: 'property-listing',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/property-listing/property-listing.module').then(
						(m) => m.PropertyListingModule
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
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
