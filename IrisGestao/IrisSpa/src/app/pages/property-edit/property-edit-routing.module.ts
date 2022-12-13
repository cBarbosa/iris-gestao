import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyEditComponent } from './property-edit.component';

const routes: Routes = [
	{
		path: '',
		component: PropertyEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class PropertyEditRoutingModule {}
