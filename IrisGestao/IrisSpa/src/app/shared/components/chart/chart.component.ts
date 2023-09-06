import { Component, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule, UIChart } from 'primeng/chart';
import { Chart } from 'chart.js';

@Component({
	selector: 'app-chart',
	standalone: true,
	imports: [CommonModule, ChartModule],
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
	@Input('data')
	dataInput: {
		data: number[];
		type: 'doughnut' | 'line' | 'bar' | 'percent' | 'pie';
		[index: string]: any;
		opt?: number;
	}[];

	@Input()
	labels: string[];

	@Input()
	label: string = 'Dataset';

	@Input()
	tension: number = 0;

	type: string;
	opt?: number;
	data: any;
	options: any;

	private configs: any;

	@ViewChild('chart') private chartComponent: UIChart;

	chart: Chart;

	ngOnInit() {
		this.type = this.dataInput[0]['type'];
		this.opt = this.dataInput[0]['opt'];
		
		const plugin = {
			id: 'canvasBackgroundColor',
			beforeDraw: (chart: Chart, args: any, options: any) => {
				console.log('options', options);
				const { ctx } = chart;
				ctx.save();
				ctx.globalCompositeOperation = 'destination-over';
				ctx.fillStyle = options.color || '#99ffff';
				ctx.fillRect(0, 0, chart.width, chart.height);
				ctx.restore();
			},
			defaults: {
				color: 'lightGreen',
			},
		};

		this.configs = {
			doughnut: {
				type: 'doughnut',
				backgroundColor: ['#641B1E', '#EAEAEA', '#C9D78E'],
				cutout: '80%',
				radius: '100%',
				plugins: [plugin],
			},
			line: {
				type: 'line',
				label: this.label,
				borderColor: '#641B1E',
				borderWidth: 2,
				fill: false,
				tension: this.tension,
				plugins: [plugin],
			},
			bar: {
				type: 'bar',
				label: this.label,
				borderWidth: 0,
				plugins: [plugin],
			},
			percent: {
				type: 'doughnut',
				backgroundColor: [this.dataInput[0]['color'], '#EAEAEA'],
				data: [this.dataInput[0]['data'], 100 - +this.dataInput[0]['data']],
				cutout: '80%',
				radius: '100%',
				plugins: [plugin],
			},
		};

		const lineBar = {
			maintainAspectRatio: false,
			aspectRatio: 0.6,
			plugins: {
				legend: {
					labels: {
						color: '#646464',
					},
				},
				canvasBackgroundColor: {
					color: 'red',
				},
			},
			scales: {
				x: {
					ticks: {
						color: '#646464',
					},
					grid: {
						display: false,
					},
				},
				y: {
					position: 'right',
					ticks: {
						color: '#646464',
						callback: (val: any, index: any) => {
							// Hide every 2nd tick label
							return `${val}`;
						},
					},
					grid: {
						color: '#CCCCCC',
					},
					border: {
						dash: [8, 5],
					},
				},
			},
		};

		const lineOps = {
			scales: {
				y: {
                    display: true,
                    position: 'right',
					suggestedMin: 0.0,
                	suggestedMax: 100.0,
					ticks: {
						color: '#646464',
						callback: (val: any, index: any) => {
							// Hide every 2nd tick label
							return `${val} %`;
						},
					},
				}
			}
		};

		const line2Ops = {
			scales: {
				y: {
                    display: true,
                    position: 'right',
					// suggestedMin: 0.0,
                	// suggestedMax: 100.0,
					ticks: {
						color: '#646464',
						// callback: (val: any, index: any) => {
						// 	// Hide every 2nd tick label
						// 	return `${val} %`;
						// },
					},
				}
			}
		};

		this.options = {
			bar: lineBar,
			line: this.type === 'line' && this.opt ? line2Ops : lineOps,
			doughnut: {
				maintainAspectRatio: true,
				aspectRatio: 1,
				plugins: {
					legend: {
						display: false,
					},
					canvasBackgroundColor: {
						color: 'red',
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
			},
			percent: {
				maintainAspectRatio: true,
				aspectRatio: 1,
				plugins: {
					legend: {
						display: false,
					},
					canvasBackgroundColor: {
						color: 'red',
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
			},
		};

		this.data = {
			labels: this.labels,
			datasets: this.dataInput.map((data, i) => {
				// is any thing
				return data['type'] !== 'percent'
					? {
							...this.configs[data['type']],
							label: `${this.label} ${i + 1}`,
							...(data as { data: number[]; [index: string]: any }),
					  }
					: {
							...this.configs['percent'],
							label: `${this.label} ${i + 1}`,
					  };
			}),
			// datasets: [
			// 	{
			// 		type: 'line',
			// 		label: 'Dataset 1',
			// 		borderColor: '#641B1E',
			// 		borderWidth: 2,
			// 		fill: false,
			// 		tension: 0,
			// 		data: [50, 25, 12, 48, 56, 76, 42],
			// 	},
			// 	{
			// 		type: 'bar',
			// 		label: 'Dataset 2',
			// 		backgroundColor: `#C9D78E`,
			// 		data: [21, 84, 24, 75, 37, 65, 34],
			// 		borderColor: 'white',
			// 		borderWidth: 2,
			// 	},
			// 	{
			// 		type: 'bar',
			// 		label: 'Dataset 3',
			// 		backgroundColor: `#641B1E`,
			// 		data: [41, 52, 24, 74, 23, 21, 32],
			// 	},
			// ],
		};
	}

	ngAfterViewInit() {
		if (this.chartComponent) {
			this.chart = this.chartComponent.chart;
		}
	}
}
