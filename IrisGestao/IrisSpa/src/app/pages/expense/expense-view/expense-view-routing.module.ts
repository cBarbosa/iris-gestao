import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseViewComponent } from './expense-view.component';

const routes: Routes = [
	{
		path: '',
		component: ExpenseViewComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ExpenseViewRoutingModule {}
