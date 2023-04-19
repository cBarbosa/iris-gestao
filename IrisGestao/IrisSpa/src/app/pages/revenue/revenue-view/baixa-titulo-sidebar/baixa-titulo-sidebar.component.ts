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
import { NgxMaskModule } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { Utils } from 'src/app/shared/utils';

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
	guidClient: string | null;

	@Input()
	guidSupplier: string | null;

	@Input()
	cancel: Function;

	@Input()
	data: {
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

	opcoesPorcentagemAdm: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	constructor(private fb: FormBuilder) {}

	ngOnInit() {
		if (this.registerOnSubmit && !this.guidClient && !this.guidSupplier)
			throw new Error(
				"contact-register-sidebar: O Guid de cliente deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		this.registerForm = this.fb.group({
			dataVencimento: [this.data?.dataVencimento ?? null, Validators.required],
			valorTotal: [this.data?.valorTotal ?? '', Validators.required],
			valorAluguel: [this.data?.valorAluguel ?? '', Validators.required],
			dataPagamento: [this.data?.dataPagamento ?? null, Validators.required],
			diasAtraso: [this.data?.diasAtraso ?? '', Validators.required],
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

		const contactObj = {
			idFornecedor: null,
			nome: editFormData.name,
			email: editFormData.email,
			telefone: editFormData.telephone,
			cargo: editFormData.role,
			dataNascimento: editFormData.birthday,
		};

		console.log('on register', contactObj);

		if (this.onSubmitForm) this.onSubmitForm(contactObj);

		// if (this.registerOnSubmit) this.registerContact();
	}

	onFileSelect(e: any) {
		this.selectedFile = e[0];
	}

	cancelEdit() {
		this.cancel();
	}
}
