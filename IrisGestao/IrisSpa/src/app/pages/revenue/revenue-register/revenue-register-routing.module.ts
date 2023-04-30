import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevenueRegisterComponent } from './revenue-register.component';

const routes: Routes = [
	{
		path: '',
		component: RevenueRegisterComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class RevenueRegisterRoutingModule {}
