import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRoutes } from './auth/auth-routing.module';
// import { HomeComponent } from './home/home.component';
// import { PropertyListingComponent } from './pages/property/property-listing/property-listing.component';
// import { PropertyItemComponent } from './shared/components/property-item/property-item.component';
import { AuthGuard } from './shared/helpers/auth/auth.guard';
import { LoggedInLayoutComponent } from './layout/logged-in/logged-in-layout.component';
import { LoggedInLayoutModule } from './layout/logged-in/logged-in-layout.module';

const routes: Routes = [
	{
		path: '',
		component: LoggedInLayoutComponent,
		children: [
			{
				path: 'home',
				loadChildren: () =>
					import('./pages/home/home.module').then((m) => m.HomeModule),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA, CLIENTE',
				},
			},
			{
				path: 'property',
				// component: PropertyListingComponent,
				loadChildren: () =>
					import('./pages/property/property.module').then(
						(m) => m.PropertyModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA, CLIENTE',
				},
			},
			{
				path: 'client',
				loadChildren: () =>
					import('./pages/client/client.module').then((m) => m.ClientModule),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
				},
			},
			{
				path: 'rent-contract',
				loadChildren: () =>
					import('./pages/rent-contract/rent-contract.module').then(
						(m) => m.RentContractModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
				},
			},
			{
				path: 'supplier-contract',
				loadChildren: () =>
					import('./pages/supplier-contract/supplier-contract.module').then(
						(m) => m.SupplierContractModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
				},
			},
			{
				path: 'supplier',
				loadChildren: () =>
					import('./pages/supplier/supplier.module').then(
						(m) => m.SupplierModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
				},
			},
			{
				path: 'revenue',
				loadChildren: () =>
					import('./pages/revenue/revenue.module').then((m) => m.RevenueModule),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
				},
			},
			{
				path: 'expense',
				loadChildren: () =>
					import('./pages/expense/expense.module').then((m) => m.ExpenseModule),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
				},
			},
			{
				path: 'construction',
				loadChildren: () =>
					import('./pages/construction/construction.module').then(
						(m) => m.ConstructionModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
				},
			},
			{
				path: 'dashboard',
				loadChildren: () =>
					import('./pages/dashboard/dashboard.module').then(
						(m) => m.DashboardModule
					),
				canActivate: [AuthGuard],
				data: {
					role: 'COORDENAÇÃO, DIRETORIA',
				},
			},
			{
				path: 'report',
				loadChildren: () =>
					import('./pages/report/report.module').then((m) => m.ReportModule),
				canActivate: [AuthGuard],
				data: {
					role: 'COORDENAÇÃO, DIRETORIA',
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
