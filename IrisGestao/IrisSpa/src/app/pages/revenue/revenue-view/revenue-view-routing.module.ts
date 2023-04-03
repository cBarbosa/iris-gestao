import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevenueViewComponent } from './revenue-view.component';

const routes: Routes = [
	{
		path: '',
		component: RevenueViewComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RevenueViewRoutingModule {}
