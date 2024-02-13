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
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'rent-amount',
		loadChildren: () =>
			import('./report-rent-value/report-rent-value.module').then(
				(m) => m.ReportRentValueModule
			),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'supply-contracts',
		loadChildren: () =>
			import('./report-supply-contracts/report-supply-contracts.module').then(
				(m) => m.ReportSupplyContractsModule
			),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'costs',
		loadChildren: () =>
			import('./report-costs/report-costs.module').then(
				(m) => m.ReportCostsModule
			),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'receipts',
		loadChildren: () =>
			import('./report-receipts/report-receipts.module').then(
				(m) => m.ReportReceiptsModule
			),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'dimob',
		loadChildren: () =>
			import('./report-dimob/report-dimob.module').then(
				(m) => m.ReportDimobModule
			),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'commercial',
		loadChildren: () =>
			import('./commercial/commercial.module').then(
				(m) => m.CommercialModule
			),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ReportRoutingModule {}
