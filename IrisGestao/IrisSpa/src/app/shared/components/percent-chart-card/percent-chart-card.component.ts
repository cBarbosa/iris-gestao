import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../chart/chart.component';
import { ChartModule } from 'primeng/chart';

@Component({
	selector: 'app-percent-chart-card',
	standalone: true,
	imports: [CommonModule, ChartModule],
	templateUrl: './percent-chart-card.component.html',
	styleUrls: ['./percent-chart-card.component.scss'],
})
export class PercentChartCardComponent {
	@Input()
	percent: number;

	@Input()
	title: string;

	@Input()
	color: string;

	@Input()
	styleClass: string = '';

	data: any;
	options: any;

	ngOnInit() {
		this.data = {
			labels: [this.title],
			datasets: [
				{
					type: 'doughnut',
					backgroundColor: [this.color, '#EAEAEA'],
					borderWidth: 0,
					data: [
						this.percent > 0 ? this.percent : 0,
						this.percent < 100 ? 100 - this.percent : 0,
					],
					cutout: '80%',
					radius: '100%',
				},
			],
		};

		this.options = {
			maintainAspectRatio: true,
			aspectRatio: 1,
			plugins: {
				legend: {
					display: false,
				},
			},
			scales: {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			},
		};
	}
}
