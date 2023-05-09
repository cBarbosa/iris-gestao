import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpenseRegisterComponent } from './expense-register.component';

const routes: Routes = [
	{
		path: '',
		component: ExpenseRegisterComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ExpenseRegisterRoutingModule {}
