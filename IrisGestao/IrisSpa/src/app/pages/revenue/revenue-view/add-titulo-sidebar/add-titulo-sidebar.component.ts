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
	selector: 'app-add-titulo-sidebar',
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
	templateUrl: './add-titulo-sidebar.component.html',
	styleUrls: ['./add-titulo-sidebar.component.scss'],
})
export class AdicionarTituloSidebarComponent {
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
				"add-titulo-sidebar: O Guid de receita deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		this.faturaPaga = this.data?.statusFatura
			? this.data.statusFatura === 'Pago' || this.data.statusFatura === 'Parcial'
			: false;

		this.form = this.fb.group({
			valor: [this.data?.valorFatura ?? null, Validators.required],
			dataVencimento: [this.data?.dataVencimento ?? null, Validators.required],
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
	}

	onSubmit(e: any) {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const editFormData = this.form.getRawValue();
		const edicaoObj = {
			valor: +editFormData.valor,
			valorRealPago: null,
			dataPagamento: null,
			dataVencimento: editFormData.dataVencimento,
			DataEmissaoNotaFiscal: null,
			numeroNotaFiscal: null,
			DescricaoBaixaFatura: null,
		};

		console.log('on register', edicaoObj);

		// if (this.onSubmitForm) this.onSubmitForm(contactObj);

		if (this.guidExpense)
			this.addInvoice(edicaoObj)
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

	addInvoice(edicaoObj: {
		valor: number;
		dataVencimento: string;
	}): Promise<unknown> {
		return new Promise((res, rej) => {
			this.revenueService
				.adicionarFatura(this.guidExpense!, edicaoObj)
				.pipe(first())
				.subscribe({
					next: (response) => {
						if (response.success) {
							this.modalContent = {
								header: 'Fatura criada com sucesso',
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
								header: 'Criação não realizado',
								message: response.message ?? '',
								isError: true,
							};
							rej(response);
						}
					},
					error: (err) => {
						this.modalContent = {
							header: 'Criação não realizado',
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
