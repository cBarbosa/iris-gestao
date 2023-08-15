import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { SidebarModule } from 'primeng/sidebar';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { RevenueService } from '../../services/revenue.service';
import { Utils } from '../../utils';
import { first } from 'rxjs';
import { ResponsiveDialogComponent } from '../responsive-dialog/responsive-dialog.component';

@Component({
	selector: 'app-sidebar-add-fatura',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		SidebarModule,
		CalendarModule,
		InputTextModule,
		ResponsiveDialogComponent,
	],
	templateUrl: './sidebar-add-fatura.component.html',
	styleUrls: ['./sidebar-add-fatura.component.scss'],
})
export class SidebarAddFaturaComponent {
	@Input()
	onRegister: Function;

	@Input()
	onSubmitForm: Function;

	// Se verdadeiro realizará o cadastro do contato ao clicar em continuar
	@Input()
	registerOnSubmit: boolean = false;

	@Input()
	guid: string | null;

	@Input()
	cancel: Function;

	@Input()
	isVisible: boolean = false;

	@Output() isVisibleChange = new EventEmitter<boolean>();

	form: FormGroup;

	onInputDate: Function;
	onBlurDate: Function;

	displayModal: boolean = false;

	editSuccess = false;

	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	constructor(
		private fb: FormBuilder,
		private revenueService: RevenueService
	) {}

	ngOnInit() {
		if (this.registerOnSubmit && !this.guid)
			throw new Error(
				"edicao-titulo-sidebar: O Guid de receita deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		this.form = this.fb.group({
			valor: [null, Validators.required],
			dataVencimento: [null, Validators.required],
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

	onSubmit(e: any) {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const editFormData = this.form.getRawValue();

		const edicaoObj = {
			valor: editFormData.valor,
			dataVencimento: editFormData.dataVencimento,
		};

		console.log('on register', edicaoObj);

		// if (this.onSubmitForm) this.onSubmitForm(contactObj);

		if (this.registerOnSubmit && this.guid) {
			// this.editInvoice(edicaoObj)
			Promise.resolve()
				.then(() => {
					this.openModal();
					if (this.onSubmitForm) this.onSubmitForm(edicaoObj);
				})
				.catch((err) => {
					this.openModal();
					console.error(err);
				});
		} else {
			if (this.onSubmitForm) this.onSubmitForm(edicaoObj);
		}
	}

	editInvoice(edicaoObj: {
		valor: number;
		dataVencimento: string;
	}): Promise<unknown> {
		return new Promise((res, rej) => {
			this.revenueService
				.editarFatura(this.guid!, edicaoObj)
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
	cancelEdit() {
		this.isVisible = false;
		this.cancel();
	}
}
