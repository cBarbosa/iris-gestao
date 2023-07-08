import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { DropdownItem } from 'src/app/shared/models/types';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { AnexoService } from 'src/app/shared/services/anexo.service';
import { Utils } from 'src/app/shared/utils';
import { first } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';
import { NgxMaskModule } from 'ngx-mask';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';

@Component({
	selector: 'app-edicao-titulo-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskModule,
		InputTextModule,
		CalendarModule,
		FileUploadComponent,
		NgxCurrencyModule,
		ResponsiveDialogComponent,
	],
	templateUrl: './edicao-titulo-sidebar.component.html',
	styleUrls: ['./edicao-titulo-sidebar.component.scss'],
})
export class EdicaoTituloSidebarComponent {
	@Input()
	onRegister: Function;

	@Input()
	onSubmitForm: Function;

	// Se verdadeiro realizará o cadastro do contato ao clicar em continuar
	@Input()
	registerOnSubmit: boolean = false;

	@Input()
	guidExpense: string | null;

	@Input()
	cancel: Function;

	@Input()
	data: {
		guidFatura: string | null;
		numeroFatura: string | null;
		dataEnvio: Date | null;
		dataEmissao: Date | null;
		anexoNf: string;
	} | null;

	registerForm: FormGroup;

	onInputDate: Function;
	onBlurDate: Function;

	selectedFile: File;

	opcoesDescricao: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	displayModal: boolean = false;

	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	opcoesPorcentagemAdm: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	constructor(
		private fb: FormBuilder,
		private expenseService: ExpenseService,
		private anexoService: AnexoService
	) {}

	ngOnInit() {
		console.log('Fatura detalhes: >> ' + JSON.stringify(this.data));

		if (this.registerOnSubmit && !this.guidExpense)
			throw new Error(
				"contact-register-sidebar: O Guid de receita deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		this.registerForm = this.fb.group({
			numeroFatura: [
				{ value: this.data?.numeroFatura ?? null, disabled: true },
				Validators.required,
			],
			dataEnvio: [
				{ value: this.data?.dataEnvio ?? null, disabled: true },
				Validators.required,
			],
			dataEmissao: [this.data?.dataEmissao ?? null, Validators.required],
			anexoNf: [this.data?.anexoNf ?? null, Validators.required],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.registerForm.controls;
	}

	checkHasError(control: AbstractControl) {
		return Utils.checkHasError(control);
	}

	onSubmit(e: any) {
		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		const editFormData = this.registerForm.getRawValue();

		const edicaoObj = {
			dataVencimento: editFormData.dataVencimento
				? editFormData.dataVencimento.toISOString()
				: '',
			dataPagamento: editFormData.dataPagamento
				? editFormData.dataPagamento.toISOString()
				: '',
			valorRealPago: editFormData.valorTotal, // ??
			DescricaoBaixaFatura: editFormData.observacoes,
		};

		console.log('on register', edicaoObj);

		// if (this.onSubmitForm) this.onSubmitForm(contactObj);

		if (this.registerOnSubmit && this.guidExpense)
			this.registerInvoice(edicaoObj)
				.then(() => {
					this.openModal();
					if (this.onSubmitForm) this.onSubmitForm(edicaoObj);
				})
				.catch((err) => {
					this.openModal();
					console.error(err);
				});
		else {
			if (this.onSubmitForm) this.onSubmitForm(edicaoObj);
		}
	}

	registerInvoice(edicaoObj: {
		dataVencimento: string;
		dataPagamento: string;
		valorRealPago: number;
		DescricaoBaixaFatura: string;
	}): Promise<unknown> {
		return new Promise((res, rej) => {
			this.expenseService
				.baixarParcela(this.guidExpense!, edicaoObj)
				.pipe(first())
				.subscribe({
					next: (response) => {
						if (response.success) {
							this.modalContent = {
								header: 'Cadastro realizado com sucesso',
								message: response.message ?? '',
								isError: false,
							};
							res(response);

							const formData = new FormData();

							formData.append('files', this.selectedFile);

							this.anexoService.registerFile(
								response.data.guidReferencia,
								formData,
								'outrosdocs'
							);
						} else {
							this.modalContent = {
								header: 'Cadastro não realizado',
								message: response.message ?? '',
								isError: true,
							};
							rej(response);
						}
					},
					error: (err) => {
						this.modalContent = {
							header: 'Cadastro não realizado',
							message: 'Houve um erro no envio de dados',
							isError: true,
						};
						rej(err);
					},
				});
		});
	}

	openModal() {
		this.displayModal = true;
	}

	closeModal() {
		this.displayModal = false;
	}

	onFileSelect(e: any) {
		this.selectedFile = e[0];
	}

	cancelEdit() {
		this.cancel();
	}
}
