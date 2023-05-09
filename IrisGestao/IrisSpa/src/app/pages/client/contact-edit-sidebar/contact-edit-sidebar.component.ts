import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { Utils } from 'src/app/shared/utils';
import {
	AbstractControl,
	FormsModule,
	ReactiveFormsModule,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import {
	ContatoService,
	ContatoUpdate,
} from 'src/app/shared/services/contato.service';
import { Contato } from 'src/app/shared/models/contato.model';
import { first } from 'rxjs';
import { NgxMaskModule } from 'ngx-mask';
import { CalendarModule } from 'primeng/calendar';
import {
	EmailValidator,
	PastDateValidator,
} from 'src/app/shared/validators/custom-validators';

@Component({
	selector: 'app-contact-edit-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		InputTextModule,
		FormsModule,
		ReactiveFormsModule,
		NgxMaskModule,
		CalendarModule,
	],
	templateUrl: './contact-edit-sidebar.component.html',
	styleUrls: ['./contact-edit-sidebar.component.scss'],
})
export class ContactEditSidebarComponent implements OnInit {
	@Input()
	data: Contato & Partial<{ dataNascimentoOriginal: string }>;

	@Input()
	onEdit: Function;

	@Input()
	cancel: Function;

	editForm: FormGroup;

	onInputDate: Function;
	onBlurDate: Function;

	constructor(
		private contatoService: ContatoService,
		private fb: FormBuilder
	) {}

	ngOnInit() {
		this.editForm = this.fb.group({
			name: [this.data.nome, Validators.required],
			role: [this.data.cargo],
			birthday: [
				this.data.dataNascimentoOriginal
					? new Date(this.data.dataNascimentoOriginal)
					: null,
				PastDateValidator,
			],
			email: [this.data.email, EmailValidator],
			telephone: [this.data.telefone],
		});
		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		// if (this.data.guidReferenciaContato) {
		// 	this.contactService
		// 		.getContact(this.data.guidReferenciaContato)
		// 		.pipe(first())
		// 		.subscribe({
		// 			next: (response) => {
		// 				console.log(response);
		// 			},
		// 			error: (err) => {
		// 				console.error(err);
		// 			},
		// 		});
		// }

		console.log(
			'data>',
			this.data.dataNascimentoOriginal
				? new Date(this.data.dataNascimentoOriginal)
				: null
		);

		// this.editForm?.patchValue({
		// 	name: this.data.nome,
		// 	role: this.data.cargo,
		// 	birthday: this.data.dataNascimento ?? null,
		// 	email: this.data.email,
		// 	telephone: this.data.telefone,
		// });
	}

	// ngOnChanges(): void {
	// this.editForm?.patchValue({
	// 	name: this.data.nome,
	// 	role: this.data.cargo,
	// 	birthday: this.data.dataNascimento ?? null,
	// 	email: this.data.email,
	// 	telephone: this.data.telefone,
	// });
	// }

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.editForm.controls;
	}

	cancelEdit() {
		this.cancel();
	}

	onSubmit(e: any) {
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		if (!this.data.guidReferenciaContato) return;

		const editFormData = this.editForm.getRawValue();

		const birthday =
			editFormData.birthday != null
				? (editFormData?.birthday as Date)?.toISOString?.()
				: null;

		const contactObj: ContatoUpdate = {
			guidClienteReferencia: this.data.guidClienteReferencia,
			guidFornecedorReferencia: this.data.guidReferenciaContato,
			nome: editFormData.name,
			email: editFormData.email,
			telefone: editFormData.telephone,
			cargo: editFormData.role,
			dataNascimento: birthday ?? null,
		};

		this.contatoService
			.updateContact(this.data.guidReferenciaContato, contactObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.onEdit({
							header: 'Atualização realizada com sucesso',
							message: response.message,
						});
					} else {
						this.onEdit({
							header: 'Atualização não realizada',
							message: response.message,
							isError: true,
						});
					}
				},
				error: (error: any) => {
					console.error(error);
					this.onEdit({
						header: 'Atualização não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					});
				},
			});
	}

	checkHasError(control: AbstractControl) {
		return Utils.checkHasError(control);
	}
}
