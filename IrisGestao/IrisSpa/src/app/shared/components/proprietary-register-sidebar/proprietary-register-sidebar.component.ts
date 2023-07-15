import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownItem } from '../../models/types';
import { ClienteService, ResponsiveService } from '../../services';
import { Utils } from '../../utils';
import {
	CnpjValidator,
	CpfCnpjValidator,
	CpfValidator,
	EmailValidator,
	PastDateValidator,
} from '../../validators/custom-validators';
import { first } from 'rxjs';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { NgxMaskModule } from 'ngx-mask';
import { ResponsiveDialogComponent } from '../responsive-dialog/responsive-dialog.component';

@Component({
	selector: 'app-proprietary-register-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SidebarModule,
		DropdownModule,
		CalendarModule,
		InputTextModule,
		NgxMaskModule,
		ResponsiveDialogComponent,
	],
	templateUrl: './proprietary-register-sidebar.component.html',
	styleUrls: ['./proprietary-register-sidebar.component.scss'],
})
export class ProprietaryRegisterSidebarComponent {
	@Input() onSubmit: Function;

	@Input() isOpen: boolean = false;

	@Output() isOpenChange = new EventEmitter<boolean>();

	registerProprietaryForm: FormGroup;

	proprietaries: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	proprietaryTypes: DropdownItem[] = [
		{ label: 'Pessoa física', value: 'cpf' },
		{ label: 'Pessoa jurídica', value: 'cnpj' },
	];

	onInputDate: Function;
	onBlurDate: Function;

	isSubmittingProprietary = false;

	registerProprietaryVisible = false;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	constructor(
		private fb: FormBuilder,
		private clienteService: ClienteService
	) {}

	ngOnInit() {
		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.registerProprietaryForm = this.fb.group({
			name: ['', [Validators.required]],
			tipoCliente: ['cpf', [Validators.required]],
			cpfCnpj: ['', [Validators.required, CpfCnpjValidator]],
			birthday: ['', [PastDateValidator]],
			email: ['', [Validators.required, EmailValidator]],
			telephone: ['', [Validators.required]],
		});
	}

	onHide = () => {
		this.isOpenChange.emit(false);
	};

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.registerProprietaryForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	get CpfCnpjMask() {
		if (this.registerProprietaryForm.controls['tipoCliente']?.value === 'cpf')
			return '000.000.000-00';
		return '00.000.000/0000-00';
	}

	get currCpfCnpj() {
		if (this.registerProprietaryForm.controls['tipoCliente']?.value === 'cpf')
			return 'CPF';
		return 'CNPJ';
	}

	get isCnpj() {
		if (this.registerProprietaryForm.controls['tipoCliente']?.value === 'cpf')
			return false;
		return true;
	}

	proprietaryTypeChange() {
		if (this.registerProprietaryForm.controls['tipoCliente'].value === 'cpf') {
			this.registerProprietaryForm.controls['cpfCnpj'].setValidators([
				Validators.required,
				CpfValidator,
			]);
			this.registerProprietaryForm.controls['birthday'].setValidators(null);
		} else {
			this.registerProprietaryForm.controls['cpfCnpj'].setValidators([
				Validators.required,
				CnpjValidator,
			]);
			this.registerProprietaryForm.controls['birthday'].setValidators(null);
		}
		this.registerProprietaryForm.controls['cpfCnpj'].updateValueAndValidity();
		this.registerProprietaryForm.controls['birthday'].updateValueAndValidity();
	}

	onProprietarySubmit() {
		if (this.registerProprietaryForm.invalid) {
			this.registerProprietaryForm.markAllAsTouched();
			return;
		}

		const proprietaryFormData = this.registerProprietaryForm.getRawValue();

		const proprietaryObj = {
			nome: proprietaryFormData.name,
			cpfCnpj: proprietaryFormData.cpfCnpj.toString(),
			dataNascimento:
				proprietaryFormData?.birthday != ''
					? (proprietaryFormData?.birthday as Date)?.toISOString?.()
					: null,
			email: proprietaryFormData.email,
			telefone: proprietaryFormData.telephone.toString(),
			idTipoCliente: 1,
			status: true,
			bairro: '',
			cidade: '',
			estado: '',
			endereco: '',
			razaoSocial: '',
		};

		this.isSubmittingProprietary = true;

		this.clienteService
			.criarCliente(proprietaryObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.modalContent = {
							header: 'Cadastro realizado',
							message:
								response.message ??
								'Cadastro de proprietário realizado com sucesso',
							isError: false,
						};

						this.registerProprietaryForm.reset();

						// this.getListaProprietarios();
						this.onSubmit?.();

						// this.setNewProprietary = () => {
						// 	this.propertyTypeForm.controls['proprietary'].setValue(
						// 		response.data.id
						// 	);
						// };

						// this.registerProprietaryVisible = false;
						this.openModal();
					} else {
						this.modalContent = {
							header: 'Cadastro não realizado',
							message:
								response.message ?? 'Erro no envio de dados de proprietário',
							isError: true,
						};

						// this.registerProprietaryVisible = false;
						this.openModal();
					}
					this.isSubmittingProprietary = false;
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Cadastro não realizado',
						message: 'Erro no envio de dados de proprietário',
						isError: true,
					};
					this.isSubmittingProprietary = false;

					// this.registerProprietaryVisible = false;
					this.openModal();
				},
			});
	}

	openModal() {
		this.displayModal = true;
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	}

	toggleModal() {
		this.displayModal = !this.displayModal;
	}
}
