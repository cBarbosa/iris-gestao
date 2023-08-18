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
import { SidebarModule } from 'primeng/sidebar';
import {
	AnexoService,
	ClienteService,
	DominiosService,
} from 'src/app/shared/services';
import { Utils } from 'src/app/shared/utils';
import { ResponsiveDialogComponent } from 'src/app/shared/components/responsive-dialog/responsive-dialog.component';
import { first } from 'rxjs';
import {
	CreateEventObj,
	EventoService,
} from 'src/app/shared/services/evento.service';
import { DropdownItem } from 'src/app/shared/models/types';
import { NgxMaskModule } from 'ngx-mask';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { DropdownModule } from 'primeng/dropdown';
import { ProprietaryRegisterSidebarComponent } from 'src/app/shared/components/proprietary-register-sidebar/proprietary-register-sidebar.component';
import { UnidadeService } from 'src/app/shared/services/unidade.service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
	selector: 'app-add-event-sidebar',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SidebarModule,
		ResponsiveDialogComponent,
		NgxMaskModule,
		InputTextModule,
		InputTextareaModule,
		CalendarModule,
		FileUploadComponent,
		DropdownModule,
		MultiSelectModule,
		NgxCurrencyModule,
		ProprietaryRegisterSidebarComponent,
	],
	templateUrl: './add-event-sidebar.component.html',
	styleUrls: ['./add-event-sidebar.component.scss'],
})
export class AddEventSidebarComponent {
	@Input()
	onSubmitForm: Function;

	@Input()
	guidProperty: string;

	@Input()
	onCancel: Function;

	@Input()
	isVisible: boolean = false;

	@Output() isVisibleChange = new EventEmitter<boolean>();

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

	opcoesTipoEvento: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	opcoesUnidade: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	proprietaries: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	registerProprietaryVisible = false;

	constructor(
		private fb: FormBuilder,
		private anexoService: AnexoService,
		private eventoService: EventoService,
		private dominiosService: DominiosService,
		private clienteService: ClienteService,
		private unidadeService: UnidadeService
	) {}

	ngOnInit() {
		console.log('guid: >> ' + this.guidProperty);

		if (!this.guidProperty)
			throw new Error(
				"edicao-titulo-sidebar: O Guid de receita deve ser informado caso o parâmetro 'registerOnSubmit' seja verdadeiro."
			);

		this.form = this.fb.group({
			tipoEvento: ['', Validators.required],
			proprietary: [null, Validators.required],
			unidade: [null, Validators.required],
			nomeEvento: ['', Validators.required],
			descricao: ['', Validators.required],
			dataEvento: ['', Validators.required],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.getListaProprietarios();

		this.unidadeService
			.getUnitByPropertyId(this.guidProperty)
			.pipe(first())
			.subscribe({
				next: (response) => {
					if (response.success) {
						const data = response.data;
						this.opcoesUnidade = this.opcoesUnidade.concat(
							data.map((item: any) => {
								return {
									label: item.tipo,
									value: item.guidReferencia,
								};
							})
						);
					}
				},
				error: (err) => {},
			});
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.form.controls;
	}

	checkHasError(control: AbstractControl) {
		return Utils.checkHasError(control);
	}

	getListaProprietarios = () => {
		this.clienteService
			.getListaProprietarios()
			.pipe(first())
			.subscribe((event) => {
				console.log('props: ', event);
				if (event.success) {
					this.proprietaries = [
						{
							label: 'Selecione',
							value: null,
							disabled: true,
						},
					];
					event.data.forEach((item: any) => {
						this.proprietaries.push({
							label: item.nome,
							value: item.guidReferencia,
							// cpfCnpj: item.cpfCnpj,
						});
					});
				}
			});
	};

	onSidebarHide = () => {
		this.isVisibleChange.emit(false);
	};

	onSidebarShow() {}

	onSubmit(e: any) {
		console.log('submitting');
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const editFormData = this.form.getRawValue();

		const edicaoObj: CreateEventObj = {
			guidImovel: this.guidProperty,
			tipoEvento: editFormData.tipoEvento,
			guidCliente: editFormData.proprietary,
			nome: editFormData.nomeEvento,
			descricao: editFormData.descricao,
			dthRealizacao: editFormData.dataEvento
				? editFormData.dataEvento.toISOString()
				: '',
			lstUnidades: editFormData.unidade,
		};

		console.log('on register', edicaoObj);

		// if (this.onSubmitForm) this.onSubmitForm(contactObj);

		this.registerEvent(edicaoObj)
			.then(() => {
				this.openModal();
				this.onSubmitForm?.(edicaoObj);
			})
			.catch((err) => {
				this.openModal();
				console.error(err);
			});
	}

	registerEvent(formObj: CreateEventObj): Promise<unknown> {
		return new Promise((res, rej) => {
			this.eventoService
				.createEvent(formObj)
				.pipe(first())
				.subscribe({
					next: (response) => {
						if (response.success) {
							this.modalContent = {
								header: 'Cadastro realizado com sucesso',
								message: response.message ?? '',
								isError: false,
							};

							this.editSuccess = true;

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

	openRegisterProprietary() {
		console.log('opening from sidebar');
		this.registerProprietaryVisible = true;
	}

	openModal() {
		this.displayModal = true;
	}

	closeModal(cb?: Function, ...args: any) {
		this.displayModal = false;

		cb?.(...args);

		if (this.editSuccess) {
			this.editSuccess = false;
			location.reload();
		}
	}

	onFileSelect(e: any) {
		this.selectedFile = e[0];
	}

	cancelRegister = () => {
		// this.isVisible = false;
		this.isVisibleChange.emit(false);
		this.onCancel?.();
	};
}
