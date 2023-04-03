import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevenueEditComponent } from './revenue-edit.component';

const routes: Routes = [
	{
		path: '',
		component: RevenueEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RevenueEditRoutingModule {}
