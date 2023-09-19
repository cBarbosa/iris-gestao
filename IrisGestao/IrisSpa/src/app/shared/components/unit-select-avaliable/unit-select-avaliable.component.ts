import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import {
	AbstractControl,
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
} from '@angular/forms';
import { UnidadeService } from 'src/app/shared/services/unidade.service';
import { first } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-unit-select-avaliable',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CheckboxModule,
		DropdownModule,
		ButtonModule,
	],
	templateUrl: './unit-select-avaliable.component.html',
	styleUrls: ['./unit-select-avaliable.component.scss'],
})
export class UnitSelectAvaliableComponent {
	@Input()
	propertyGuid: string;

	@Input()
	rentContractGuid: string;

	@Input()
	currentUnits: string[];

	@Output() selectedEvent = new EventEmitter<string[]>();

	form: FormGroup;

	options: DropdownItem[] = [
		{
			value: null,
			label: 'Selecione',
		},
	];

	units: {
		guid: string;
		name: string;
	}[] = [];

	selectedUnits: {
		guid: string;
		name: string;
	}[] = [];

	isAdding = false;

	constructor(private fb: FormBuilder, 
		private unidadeService: UnidadeService) {
		this.form = this.fb.group({
			units: new FormArray([]),
		});

		this.setCheckboxes();
	}
	
	ngOnInit() {
		let unidades = this.currentUnits.toString();
		console.log('unidades Locadas >> ' + unidades);
		this.unidadeService
			.getAvailableUnitByProperty(this.propertyGuid, unidades)
			.pipe(first())
			.subscribe({
				next: (event) => {
					if (event.data) {
						const units = event.data;

						this.units = units.map((unit: any) => {
							return {
								guid: unit.guidReferencia,
								name: unit.tipo,
							};
						});

						this.options = this.options.concat(
							this.units
								.filter((u) => !this.currentUnits.includes(u.guid))
								.map((u) => ({
									label: u.name,
									value: u,
								}))
						);

						this.units.forEach((u) => {
							if (this.currentUnits.includes(u.guid)) {
								this.selectedUnits.push(u);
							}
							//  else {
							// 	this.options.push({
							// 		label: u.name,
							// 		value: u,
							// 	});
							// }
						});

						this.selectedEvent.emit(this.selectedUnits.map((u) => u.guid));
						this.setCheckboxes();
					}
				},
				error: (err) => { console.error(err)},
			});
	}

	get unitControl() {
		return this.form.controls['units'] as FormArray;
	}

	// values = '';

	// reduceValues() {
	// 	this.values = this.unitControl.controls.reduce(
	// 		(a, u) => a + ', ' + u.value,
	// 		''
	// 	);
	// 	console.log(this.values);
	// }

	private setCheckboxes() {
		const controls: AbstractControl[] = [];
		this.selectedUnits
			// .filter((u) => !!u.guid)
			.forEach((u, i) => {
				// if (this.unitControl.controls[i]) {
				// 	controls.push(new FormControl(this.unitControl.controls[i].value));
				// } else {
				controls.push(new FormControl(true));
				// }
			});

		this.unitControl.clear();
		controls.forEach((c) => this.unitControl.push(c));
	}

	selectUnit(e: any) {
		const unit = e.value;

		if (!this.selectedUnits.some((u) => u.guid === unit.guid)) {
			this.selectedUnits.push(unit);
		}
		this.setCheckboxes();
		this.setIsAdding(false);
		this.setOptions();
	}

	setIsAdding(isAdding?: boolean) {
		this.isAdding = isAdding ?? true;

		if (!this.isAdding) {
			//emit
			this.selectedEvent.emit(this.selectedUnits.map((u) => u.guid));
		}
	}

	uncheck(index: number) {
		this.selectedUnits.splice(index, 1);
		console.log(this.selectedUnits);

		this.setCheckboxes();

		this.setOptions();

		this.setIsAdding(false);

		console.log('options', this.options);
	}

	private setOptions() {
		this.options = [
			{
				label: 'Selecione',
				value: null,
			},
		];

		this.units.forEach((u) => {
			if (!this.selectedUnits.some((su) => su.guid === u.guid)) {
				// console.log('adding > ', u);
				this.options.push({
					label: u.name,
					value: u,
				});
			}
		});
	}

	submit() {
		// 	const selectedOrderIds = this.form.value.orders
		// 		.map((checked: any, i: number) => (checked ? this.units[i].value : null))
		// 		.filter((v: any) => v !== null);
		// 	console.log(selectedOrderIds);
	}
}
