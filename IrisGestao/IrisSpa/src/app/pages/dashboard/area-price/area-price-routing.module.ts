import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaPriceComponent } from './area-price.component';

const routes: Routes = [
	{
		path: '',
		component: AreaPriceComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class AreaPriceRoutingModule {}
