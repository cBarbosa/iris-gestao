import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstructionViewComponent } from './construction-view.component';

const routes: Routes = [
	{
		path: '',
		component: ConstructionViewComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ConstructionViewRoutingModule {}
