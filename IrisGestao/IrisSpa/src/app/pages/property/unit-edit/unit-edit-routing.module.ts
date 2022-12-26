import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitEditComponent } from './unit-edit.component';

const routes: Routes = [
	{
		path: '',
		component: UnitEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class UnitEditRoutingModule {}
