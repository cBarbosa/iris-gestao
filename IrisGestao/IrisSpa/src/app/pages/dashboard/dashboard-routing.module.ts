import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: 'financial-vacancy',
		loadChildren: () =>
			import('./financial-vacancy/financial-vacancy.module').then(
				(m) => m.FinancialVacancyModule
			),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'receiving-performance',
		loadChildren: () =>
			import('./receiving-performance/receiving-performance.module').then(
				(m) => m.ReceivingPerformanceModule
			),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'area-price',
		loadChildren: () =>
			import('./area-price/area-price.module').then((m) => m.AreaPriceModule),
		data: {
			role: 'COORDENAÇÃO, DIRETORIA',
		},
	},
	{
		path: 'managed-area',
		loadChildren: () =>
			import('./managed-area/managed-area.module').then(
				(m) => m.ManagedAreaModule
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
export class DashboardRoutingModule {}
