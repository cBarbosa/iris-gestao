import { NgModule } from '@angular/core';
import {
    RouterModule,
    Routes
} from '@angular/router';
import { ReceivingPerformanceComponent } from './receiving-performance.component';

const routes: Routes = [
	{
		path: '',
		component: ReceivingPerformanceComponent,
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class ReceivingPerformanceRoutingModule { };
