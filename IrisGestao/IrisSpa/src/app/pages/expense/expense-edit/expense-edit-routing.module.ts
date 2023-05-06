import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseEditComponent } from './expense-edit.component';

const routes: Routes = [
	{
		path: '',
		component: ExpenseEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ExpenseEditRoutingModule {}
