import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { FinancialVacancyComponent } from './financial-vacancy.component';

const routes: Routes = [
	{
		path: '',
		component: FinancialVacancyComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class FinancialVacancyRoutingModule { };
