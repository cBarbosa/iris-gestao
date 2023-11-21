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
import { InputTextarea, InputTextareaModule } from 'primeng/inputtextarea';
import { RevenueService } from 'src/app/shared/services/revenue.service';

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
		dataPagamento: string;
		descricaoBaixaFatura: string;
		guidReferencia: string;
		numeroFatura: string;
		numeroParcela: number;
		status: boolean;
		statusFatura: string;
		valorFatura: number;
		valorRealPago: number;
	} | null;

	faturaPaga: boolean = false;

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
		private revenueService: RevenueService,
		private anexoService: AnexoService
	) {}

	ngOnInit() {
		// console.debug('Fatura detalhes: >> ' + JSON.stringify(this.data));
		// console.debug('guid: >> ' + this.guidExpense);

		if (this.registerOnSubmit && !this.guidExpense)
			throw new Error(
				"edicao-titulo-sidebar: O Guid de receita deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		this.faturaPaga = this.data?.statusFatura
			? this.data.statusFatura === 'Pago' || this.data.statusFatura === 'Parcial'
			: false;

		this.form = this.fb.group({
			numeroFatura: [this.data?.numeroFatura ?? null, Validators.required],
			numeroNotaFiscal: [
				{ value: this.data?.numeroFatura ?? null, disabled: true },
			],
			numeroParcela: [this.data?.numeroParcela ?? null],
			valor: [this.data?.valorFatura ?? null, Validators.required],
			valorPago: [
				{ value: this.data?.valorRealPago ?? '', disabled: !this.faturaPaga },
				Validators.required,
			],
			dataVencimento: [this.data?.dataVencimento ?? null, Validators.required],
			dataPagamento: [
				{ value: this.data?.dataPagamento ?? null, disabled: !this.faturaPaga },
				Validators.required,
			],
			observacoes: [
				{
					value: this.data?.descricaoBaixaFatura ?? '',
					disabled: !this.faturaPaga,
				},
				Validators.required,
			],
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

		this.faturaPaga = this.data?.statusFatura
			? this.data.statusFatura === 'Pago' || this.data.statusFatura === 'Parcial'
			: false;

		if (this.faturaPaga) {
			this.form.controls['numeroFatura'].enable();
			this.form.controls['valorPago'].enable();
			this.form.controls['dataPagamento'].enable();
			this.form.controls['observacoes'].enable();
		} else {
			this.form.controls['numeroFatura'].disable();
			this.form.controls['valorPago'].disable();
			this.form.controls['dataPagamento'].disable();
			this.form.controls['observacoes'].disable();
		}

		this.form.setValue({
			numeroFatura: this.data?.numeroFatura ?? '',
			valor: this.data?.valorFatura ?? '',
			valorPago: this.data?.valorRealPago ?? '',
			numeroNotaFiscal: this.data?.numeroFatura ?? '',
			numeroParcela: this.data?.numeroParcela ?? '',
			dataVencimento: this.data?.dataVencimento
				? new Date(this.data?.dataVencimento)
				: '',
			dataPagamento: this.data?.dataPagamento
				? new Date(this.data?.dataPagamento)
				: '',
			observacoes: this.data?.descricaoBaixaFatura ?? '',
		});
	}

	onSubmit(e: any) {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const editFormData = this.form.getRawValue();
		const edicaoObj = {
			numeroFatura: +editFormData.numeroParcela,
			valor: +editFormData.valor,
			valorRealPago: +editFormData.valorPago,
			dataPagamento: editFormData.dataPagamento === "" ? null : editFormData.dataPagamento,
			dataVencimento: editFormData.dataVencimento,
			DataEmissaoNotaFiscal: editFormData.dataEmissao,
			numeroNotaFiscal: editFormData.numeroNotaFiscal,
			DescricaoBaixaFatura: editFormData.observacoes,
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
		dataVencimento: string;
	}): Promise<unknown> {
		return new Promise((res, rej) => {
			this.revenueService
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
