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
import { SidebarModule } from 'primeng/sidebar';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
	selector: 'app-edicao-titulo-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskModule,
		InputTextModule,
		InputTextareaModule,
		CalendarModule,
		FileUploadComponent,
		NgxCurrencyModule,
		ResponsiveDialogComponent,
		SidebarModule,
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
	editAllFields: boolean = false;

	@Input()
	guidExpense: string | null;

	@Input()
	cancel: Function;

	@Input()
	isVisible: boolean = false;

	@Output() isVisibleChange = new EventEmitter<boolean>();

	@Input()
	data: {
		dataCriacao: string;
		dataUltimaModificacao: string;
		dataVencimento: string;
		descricaoBaixaFatura: string;
		guidReferencia: string;
		numeroFatura: string;
		numeroParcela: number;
		status: boolean;
		statusFatura: string;
		valorFatura: number;
	} | null;

	form: FormGroup;

	onInputDate: Function;
	onBlurDate: Function;

	selectedFile: File;

	displayModal: boolean = false;

	editSuccess = false;

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
		console.log('guid: >> ' + this.guidExpense);
		console.log('Edit all fields: >> ' + this.editAllFields);
		//console.log('Status fatura >> ' + this.data?.statusFatura );

		if (this.registerOnSubmit && !this.guidExpense)
			throw new Error(
				"edicao-titulo-sidebar: O Guid de receita deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		this.form = this.fb.group({
			numeroNotaFiscal: [
				{ value: this.data?.numeroFatura ?? null, disabled: true },
			],
			numeroParcela: [
				{ value: this.data?.numeroParcela ?? null, disabled: true},
			],
			valor: [this.data?.valorFatura ?? null, Validators.required],
			dataVencimento: [this.data?.dataVencimento ?? null, Validators.required],
			statusFatura: [this.data?.statusFatura ?? null],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.form.controls;
	}

	checkHasError(control: AbstractControl) {
		return Utils.checkHasError(control);
	}

	onSidebarHide() {
		this.isVisibleChange.emit(false);
	}

	onSidebarShow() {
		console.log('patching values', this.data);
		this.form.setValue({
			valor: this.data?.valorFatura,
			numeroNotaFiscal: this.data?.numeroFatura,
			numeroParcela: this.data?.numeroParcela,
			statusFatura: this.data?.statusFatura,
			dataVencimento: this.data?.dataVencimento
				? new Date(this.data?.dataVencimento)
				: '',
		});
	}

	onSubmit(e: any) {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const editFormData = this.form.getRawValue();

		const edicaoObj = {
			valor: editFormData.valor,
			valorRealPago: null,
			dataPagamento: null,
			dataVencimento: editFormData.dataVencimento,
			numeroNotaFiscal: editFormData.numeroNotaFiscal,
			dataEmissaoNotaFiscal: editFormData.dataEmissaoNotaFiscal,
			dataEnvio: editFormData.dataEnvio,
			porcentagemImpostoRetido: null,
			valorLiquidoTaxaAdministracao: null,
			descricaoBaixaFatura: null,
		};

		console.log('on register', edicaoObj);

		// if (this.onSubmitForm) this.onSubmitForm(contactObj);

		if (this.registerOnSubmit && this.guidExpense)
			this.editInvoice(edicaoObj)
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

	editInvoice(edicaoObj: {
		valor: number;
		valorRealPago: number | null;
		dataPagamento: string | null;
		dataVencimento: string;
		numeroNotaFiscal: string;
		dataEmissaoNotaFiscal: string;
		dataEnvio: string;
		porcentagemImpostoRetido: number | null;
		valorLiquidoTaxaAdministracao: number | null;
		descricaoBaixaFatura: string | null;
	}): Promise<unknown> {
		return new Promise((res, rej) => {
			this.expenseService
				.editarFatura(this.guidExpense!, edicaoObj)
				.pipe(first())
				.subscribe({
					next: (response) => {
						if (response.success) {
							this.modalContent = {
								header: 'Edição realizada com sucesso',
								message: response.message ?? '',
								isError: false,
							};

							this.editSuccess = true;

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
								header: 'Edição não realizado',
								message: response.message ?? '',
								isError: true,
							};
							rej(response);
						}
					},
					error: (err) => {
						this.modalContent = {
							header: 'Edição não realizado',
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

		if (this.editSuccess) {
			this.editSuccess = false;
			location.reload();
		}
	}

	onFileSelect(e: any) {
		this.selectedFile = e[0];
	}

	cancelEdit() {
		this.isVisible = false;
		this.cancel();
	}
}
