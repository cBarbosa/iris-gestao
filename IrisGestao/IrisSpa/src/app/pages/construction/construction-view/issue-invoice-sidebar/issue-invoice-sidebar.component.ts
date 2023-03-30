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
import { NgxMaskModule } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import {
	EmailValidator,
	PastDateValidator,
} from 'src/app/shared/validators/custom-validators';
import { Utils } from 'src/app/shared/utils';
import { FileUploadModule } from 'primeng/fileupload';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};

@Component({
	selector: 'app-issue-invoice-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskModule,
		CalendarModule,
		InputTextModule,
		DropdownModule,
		FileUploadModule,
	],
	templateUrl: './issue-invoice-sidebar.component.html',
	styleUrls: ['./issue-invoice-sidebar.component.scss'],
})
export class IssueInvoiceSidebarComponent {
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
		descricao: number;
		valorOrcamento: number;
		valorContratado: number;
		valorServico: number;
		dataEmissao: Date;
		numeroNota: string;
		dataVencimentoFatura: Date;
		porcentagemAdm: number;
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
			descricao: [this.data?.descricao ?? null, Validators.required],
			valorOrcamento: [this.data?.valorOrcamento ?? '', Validators.required],
			valorContratado: [this.data?.valorContratado ?? '', Validators.required],
			valorServico: [this.data?.valorServico ?? '', Validators.required],
			dataEmissao: [this.data?.dataEmissao ?? '', Validators.required],
			numeroNota: [this.data?.numeroNota ?? '', Validators.required],
			dataVencimentoFatura: [
				this.data?.dataVencimentoFatura ?? '',
				Validators.required,
			],
			porcentagemAdm: [this.data?.porcentagemAdm ?? null, Validators.required],
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
		this.selectedFile = e.currentFiles[0];
	}

	cancelEdit() {
		this.cancel();
	}
}
