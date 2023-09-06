import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart';
import { Chart } from 'chart.js';

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

	@Input('data')
	dataInput: Array<{
		percent: number;
		title: string;
		color: string;
	}>;

	@ViewChild('chart') private PercentChartCardComponent: UIChart;
	chart: Chart;

	data: any;
	options: any;

	ngOnInit() {

		this.data = {
			labels: this.fcnList(this.dataInput, `title`),
			datasets: [
				{
					type: 'doughnut',
					backgroundColor: this.fcnList(this.dataInput, `color`),
					borderWidth: 0,
					data: this.fcnList(this.dataInput, `percent`),
					cutout: '80%',
					radius: '100%',
				}
			]
		};

		const plugins = {
			id: 'text',
			beforeDraw: function (chart: Chart, a: any, b:any) {
			  var width = chart.width,
				height = chart.height,
				ctx = chart.ctx;
  
			  ctx.restore();
			  var fontSize = (height / 114).toFixed(2);
			  ctx.font = fontSize + 'em sans-serif';
			  ctx.textBaseline = 'middle';
  
			  var text = '75%',
				textX = Math.round((width - ctx.measureText(text).width) / 2),
				textY = height / 2;
  
			  ctx.fillText(text, textX, textY);
			  ctx.save();
			}
		};

		const _plugins = {
			legend: {
				display: true,
				position: 'right',
				labels: {
					boxWidth: 17,
					boxHeight: 15,
					color: '#000000',
				  }
			},
		};

		this.options = {
			maintainAspectRatio: true,
			aspectRatio: 2,
			responsive: true,
			plugins: plugins,
			scales: {
				x: {
					display: false,
				},
				y: {
					display: false,
				}
			}
		};
	}

	fcnList = (
		lista: Array<{title: string, percent: number, color: string}>,
		opt: string = `label`
	) : Array<string| number> => {

		if(opt === `color`)
			return lista.map(item => item.color);

		if(opt === `percent`)
			return lista.map(item => item.percent);

		return lista.map(item => item.title);
	};

	ngAfterViewInit() {
		if (this.PercentChartCardComponent) {
			this.chart = this.PercentChartCardComponent.chart;
		}
	}
}
