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
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'receiving-performance',
		loadChildren: () =>
			import('./receiving-performance/receiving-performance.module').then(
				(m) => m.ReceivingPerformanceModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'area-price',
		loadChildren: () =>
			import('./area-price/area-price.module').then((m) => m.AreaPriceModule),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
	{
		path: 'managed-area',
		loadChildren: () =>
			import('./managed-area/managed-area.module').then(
				(m) => m.ManagedAreaModule
			),
		data: {
			role: 'SUPERINTENDENTE,GERENTE,COORDENADOR,ANALISTA',
		},
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardRoutingModule {}
