import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgxMaskModule } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { Utils } from 'src/app/shared/utils';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RevenueService } from 'src/app/shared/services/revenue.service';
import { first } from 'rxjs';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';
import { AnexoService } from 'src/app/shared/services/anexo.service';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-baixa-titulo-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskModule,
		CalendarModule,
		InputTextModule,
		DropdownModule,
		FileUploadComponent,
		NgxCurrencyModule,
		InputTextareaModule,
		ResponsiveDialogComponent,
	],
	templateUrl: './baixa-titulo-sidebar.component.html',
	styleUrls: ['./baixa-titulo-sidebar.component.scss'],
})
export class BaixaTituloSidebarComponent {
	@Input()
	onRegister: Function;

	@Input()
	onSubmitForm: Function;

	// Se verdadeiro realizará o cadastro do contato ao clicar em continuar
	@Input()
	registerOnSubmit: boolean = false;

	@Input()
	guidRevenue: string | null;

	@Input()
	cancel: Function;

	@Input()
	data: {
		guidFatura: string | null;
		numeroFatura: string | null;
		dataVencimento: Date | null;
		valorTotal: number;
		valorAluguel: number;
		dataPagamento: Date | null;
		diasAtraso: number;
		// dataVencimentoFatura: Date | null;
		observacoes: string;
		anexoNf: string;
	} | null;

	registerForm: FormGroup;

	requestObj: {
		dataVencimento: string;
		dataPagamento: string;
		valorRealPago: number;
		DescricaoBaixaFatura: string;
	} | null = null;

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
		private revenueService: RevenueService,
		private anexoService: AnexoService
	) {}

	ngOnInit() {
		console.log('Fatura detalhes: >> ' + JSON.stringify(this.data));

		if (this.registerOnSubmit && !this.guidRevenue)
			throw new Error(
				"contact-register-sidebar: O Guid de receita deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		const dateDiff = this.data
			? Utils.dateDiffInDays(
					this.data.dataPagamento ?? undefined,
					this.data.dataVencimento ?? undefined
			  )
			: 0;
		const diasAtraso = dateDiff && dateDiff < 0 ? dateDiff : '0';

		this.registerForm = this.fb.group({
			numeroFatura: [
				{ value: this.data?.numeroFatura ?? null, disabled: true },
				Validators.required,
			],
			dataVencimento: [
				{ value: this.data?.dataVencimento ?? null, disabled: true },
				Validators.required,
			],
			valorTotal: [
				{ value: this.data?.valorTotal ?? '', disabled: true },
				Validators.required,
			],
			valorAluguel: [this.data?.valorAluguel ?? '', Validators.required],
			dataPagamento: [this.data?.dataPagamento ?? null, Validators.required],
			diasAtraso: [
				{
					value: diasAtraso,
					disabled: true,
				},
				Validators.required,
			],
			observacoes: [this.data?.observacoes ?? '', Validators.required],
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

		this.requestObj = {
			dataVencimento: editFormData.dataVencimento
				? editFormData.dataVencimento.toISOString()
				: '',
			dataPagamento: editFormData.dataPagamento
				? editFormData.dataPagamento.toISOString()
				: '',
			valorRealPago: editFormData.valorTotal, // ??
			DescricaoBaixaFatura: editFormData.observacoes,
		};

		console.log('on register', this.requestObj);

		// if (this.onSubmitForm) this.onSubmitForm(contactObj);

		if (this.registerOnSubmit && this.guidRevenue)
			this.registerInvoice(this.requestObj)
				.then(() => {
					this.openModal();
				})
				.catch((err) => {
					this.openModal();
					console.error(err);
				});
		else {
			if (this.onSubmitForm) this.onSubmitForm(this.requestObj);
		}
	}

	registerInvoice(baixaObj: {
		dataVencimento: string;
		dataPagamento: string;
		valorRealPago: number;
		DescricaoBaixaFatura: string;
	}): Promise<unknown> {
		return new Promise((res, rej) => {
			this.revenueService
				.baixarParcela(this.guidRevenue!, baixaObj)
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

							this.anexoService
								.registerFile(
									response.data.guidReferencia,
									formData,
									'outrosdocs'
								)
								.pipe(first())
								.subscribe();
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

	closeModal(success = false) {
		this.displayModal = false;
		if (success && this.onSubmitForm) this.onSubmitForm(this.requestObj);
	}

	onFileSelect(e: any) {
		this.selectedFile = e[0];
		console.log('selecting on sidebar', this.selectedFile);
	}

	cancelEdit() {
		this.cancel();
	}
}
