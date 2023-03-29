import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstructionRegisterComponent } from './construction-register.component';

const routes: Routes = [
	{
		path: '',
		component: ConstructionRegisterComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ConstructionRegisterRoutingModule {}
