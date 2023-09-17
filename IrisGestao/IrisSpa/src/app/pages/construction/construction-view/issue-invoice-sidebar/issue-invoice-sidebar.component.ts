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
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { ConstructionService } from 'src/app/shared/services/obra.service';
import { first } from 'rxjs';
import { DominiosService } from 'src/app/shared/services';
import { NgxCurrencyModule } from 'ngx-currency';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';

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
		FileUploadComponent,
		NgxCurrencyModule,
		ResponsiveDialogComponent
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
	guidInvoice: string | null;

	@Input()
	cancel: Function;

	@Input()
	data: {
		guidReferencia: string;
		descricao: string;
		valorOrcado: number;
		valorContratado: number;
		// valorServico: number;
		dataEmissao?: Date;
		numeroNota: string;
		dataVencimento: Date;
		percentualAdministracaoObra?: number;
		anexoNf?: string;
	} | null;

	registerForm: FormGroup;

	onInputDate: Function;
	onBlurDate: Function;

	selectedFile: File;

	constructor(
		private fb: FormBuilder,
		private constructionService: ConstructionService,
		private dominiosService: DominiosService
	) {}

	ngOnInit() {
		if (this.registerOnSubmit && !this.guidInvoice)
			throw new Error(
				"contact-register-sidebar: O Guid de cliente deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		this.registerForm = this.fb.group({
			guidReferencia: this.data?.guidReferencia,
			descricao: [this.data?.descricao ?? null, Validators.required],
			valorOrcamento: [this.data?.valorOrcado ?? '', Validators.required],
			valorContratado: [this.data?.valorContratado ?? '', Validators.required],
			// valorServico: [this.data?.valorServico ?? '', Validators.required],
			porcentagemAdm: [this.data?.percentualAdministracaoObra ?? null],
			dataEmissao: [this.data?.dataEmissao ?? null],
			dataVencimentoFatura: [this.data?.dataVencimento ?? '', Validators.required],
			numeroNota: [this.data?.numeroNota ?? null],
			anexoNf: [this.data?.anexoNf ?? null]
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.getData();
	}

	getData = ():void => {
		
		if(!this.guidInvoice)
			return;

		this.registerForm.patchValue({
			guidReferencia: this.data?.guidReferencia,
			descricao: this.data?.descricao,
			valorOrcamento: this.data?.valorOrcado,
			valorContratado: this.data?.valorContratado,
			// valorServico: this.data?.valorServico,
			dataEmissao: this.data?.dataEmissao ? new Date(this.data?.dataEmissao) : '',
			numeroNota: this.data?.numeroNota ?? null,
			dataVencimentoFatura: this.data?.dataVencimento
				? new Date(this.data?.dataVencimento)
				: '',
			porcentagemAdm: this.data?.percentualAdministracaoObra ?? null,
		});

	};

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.registerForm.controls;
	}

	checkHasError(control: AbstractControl) {
		return Utils.checkHasError(control);
	}

	onSubmit(e: any) {

		console.log(e);

		console.log(this.registerForm.invalid);

		console.log(this.registerForm);

		console.log(this.onSubmitForm);

		console.log(this.registerOnSubmit);

		if (this.registerForm.invalid) {
			this.registerForm.markAllAsTouched();
			return;
		}

		const formObj = this.registerForm.getRawValue();

		const valuesObj = {
			formValues: formObj,
			invoiceFile: this.selectedFile,
		};

		if (this.onSubmitForm) this.onSubmitForm(valuesObj);

		// if (this.registerOnSubmit) this.registerContact();
	}

	onFileSelect(e: any) {
		this.selectedFile = e[0];
	}

	cancelEdit() {
		this.cancel();
	}
}
