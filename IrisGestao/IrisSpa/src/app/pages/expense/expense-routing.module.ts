import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'listing',
		loadChildren: () =>
			import('./expense-listing/expense-listing.module').then(
				(m) => m.ExpenseListingModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'details/:guid',
		loadChildren: () =>
			import('./expense-view/expense-view.module').then(
				(m) => m.ExpenseViewModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'edit/:guid',
		loadChildren: () =>
			import('./expense-edit/expense-edit.module').then(
				(m) => m.ExpenseEditModule
			),
		data: {
			role: 'COMERCIAL, ADMINISTRATIVO, COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'register',
		loadChildren: () =>
			import('./expense-register/expense-register.module').then(
				(m) => m.ExpenseRegisterModule
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
export class ExpenseRoutingModule {}
