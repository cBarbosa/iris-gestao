import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstructionEditComponent } from './construction-edit.component';

const routes: Routes = [
	{
		path: '',
		component: ConstructionEditComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ConstructionEditRoutingModule {}
