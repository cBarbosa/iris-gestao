import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'leased-area',
		loadChildren: () =>
			import('./report-leased-area/report-leased-area.module').then(
				(m) => m.ReportLeasedAreaModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'rent-amount',
		loadChildren: () =>
			import('./report-rent-value/report-rent-value.module').then(
				(m) => m.ReportRentValueModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'supply-contracts',
		loadChildren: () =>
			import('./report-supply-contracts/report-supply-contracts.module').then(
				(m) => m.ReportSupplyContractsModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	// {
	// 	path: 'edit/:guid',
	// 	loadChildren: () =>
	// 		import('./revenue-edit/revenue-edit.module').then(
	// 			(m) => m.RevenueEditModule
	// 		),
	// 	data: {
	// 		role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
	// 	},
	// },
	// {
	// 	path: 'register',
	// 	loadChildren: () =>
	// 		import('./revenue-register/revenue-register.module').then(
	// 			(m) => m.RevenueRegisterModule
	// 		),
	// 	data: {
	// 		role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
	// 	},
	// },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ReportRoutingModule {}
