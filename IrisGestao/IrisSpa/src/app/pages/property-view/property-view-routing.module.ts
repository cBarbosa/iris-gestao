import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyViewComponent } from './property-view.component';

const routes: Routes = [
	{
		path: '',
		component: PropertyViewComponent,
		// loadComponent: () =>
		// 	import('./users.component').then((m) => UsersComponent),
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PropertyViewRoutingModule {}
