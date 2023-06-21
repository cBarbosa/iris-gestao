import {
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { NgxMaskModule } from 'ngx-mask';
import {
	ContatoService,
	ContatoUpdate,
} from 'src/app/shared/services/contato.service';
import { first } from 'rxjs';
import { Utils } from 'src/app/shared/utils';
import { InputTextModule } from 'primeng/inputtext';
import { Contato } from 'src/app/shared/models/contato.model';
import {
	EmailOrUrlValidator,
	PastDateValidator,
} from 'src/app/shared/validators/custom-validators';

@Component({
	selector: 'app-contact-register-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskModule,
		CalendarModule,
		InputTextModule,
	],
	templateUrl: './contact-register-sidebar.component.html',
	styleUrls: ['./contact-register-sidebar.component.scss'],
})
export class ContactRegisterSidebarComponent implements OnInit {
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
		dataCriacao: string;
		nome: string;
		email: string;
		telefone: string;
		cargo: string;
		dataNascimento: Date;
	} | null;

	registerForm: FormGroup;

	onInputDate: Function;
	onBlurDate: Function;

	constructor(
		private contatoService: ContatoService,
		private fb: FormBuilder
	) {}

	ngOnInit() {
		if (this.registerOnSubmit && !this.guidClient && !this.guidSupplier)
			throw new Error(
				"contact-register-sidebar: O Guid de cliente deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);
		console.log('Guid cliente >> ' + this.guidClient);
		console.log('Guid fornecedor >> ' + this.guidSupplier);
		this.registerForm = this.fb.group({
			name: [this.data?.nome ?? '', Validators.required],
			role: [this.data?.cargo ?? ''],
			birthday: [this.data?.dataNascimento ?? null, PastDateValidator],
			email: [this.data?.email ?? '', EmailOrUrlValidator],
			telephone: [this.data?.telefone ?? ''],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.registerForm.controls;
	}

	cancelEdit() {
		this.cancel();
	}

	registerContact() {
		if (!this.registerOnSubmit) return;

		const contactObj = {
			guidClienteReferencia: this.guidClient,
			guidFornecedorReferencia: this.guidSupplier,
			idFornecedor: null,
			idCliente: null,
			nome: this.f['name'].value,
			email: this.f['email'].value,
			telefone: this.f['telephone'].value,
			cargo: this.f['role'].value,
			dataNascimento: this.f['birthday'].value,
		};

		this.contatoService.registerContact(contactObj).subscribe({
			next: (response) => {
				if (response.success) {
					this.onRegister({
						header: 'Contato registrado',
						message: response.message ?? 'Contato registrado com sucesso',
					});
				} else {
					this.onRegister({
						header: 'Contato não registrado',
						message: response.message ?? 'Erro no registro de contato',
						isError: true,
					});
				}
			},
			error: (err) => {
				console.error(err);
				this.onRegister({
					header: 'Contato não registrado',
					message: 'Erro no envio de dados',
					isError: true,
				});
			},
		});
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

		if (this.registerOnSubmit) this.registerContact();
	}

	checkHasError(control: AbstractControl) {
		return Utils.checkHasError(control);
	}
}
