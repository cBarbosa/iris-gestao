import { Location } from '@angular/common';
import { preserveWhitespacesDefault } from '@angular/compiler';
import { Component } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormGroup,
	Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ClienteService, DominiosService, AnexoService, Attachment} from 'src/app/shared/services';
import { RevenueService } from 'src/app/shared/services/revenue.service';
import { Utils } from 'src/app/shared/utils';

type DropdownItem = {
	label: string;
	value: any;
	disabled?: boolean;
};


type Base64Metadata = {
	name: string;
	data: File | string | ArrayBuffer | null;
	mimetype: string;
	isNew?: boolean;
	id?: number | string;
};

@Component({
	selector: 'app-revenue-edit',
	templateUrl: './revenue-edit.component.html',
	styleUrls: ['./revenue-edit.component.scss'],
})
export class RevenueEditComponent {
	editForm: FormGroup;

	revenueGuid: string;
	revenue: any;
	isLoading = false;
	invalidGuid = false;

	// CAPA
	displayCropModal = false;
	defaultCoverImage: string | null = null;
	imageChangedEvent: any = '';
	croppedCover: any = null;
	auxCroppedCover: any = null;
	attachmentsObj:
		| Partial<{
				capa: Attachment;
				foto: Attachment[];
				habitese: Attachment;
				projeto: Attachment;
				matricula: Attachment;
				outrosdocs: Attachment[];
		  }>
		| undefined;


	expensePhotos: Base64Metadata[] = [];

	
	imovelTitulo: any;

	displayModal = false;
	modalContent: {
		isError?: boolean;
		header?: string;
		message: string;
	} = {
		message: '',
	};

	onInputDate: Function;
	onBlurDate: Function;

	opcoesPlanoContas: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];
	opcoesCreditarPara: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];
	opcoesNomeLocador: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
		{
			label: 'Administradora',
			value: 1,
		},
	];
	opcoesFormaPagamento: DropdownItem[] = [
		{
			label: 'Selecione',
			value: null,
			disabled: true,
		},
	];

	imovel = {
		nome: '',
		tipo: 'Edifício corporativo',
		endereco: '',
	};
	constructor(
		private fb: FormBuilder,
		private location: Location,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private revenueService: RevenueService,
		private dominiosService: DominiosService,
		private clienteService: ClienteService,
		private anexoService: AnexoService
	) {}

	ngOnInit() {
		const revenueGuid = this.activatedRoute.snapshot.paramMap.get('guid');

		if (revenueGuid === null) {
			this.isLoading = false;
			this.invalidGuid = true;
			return;
		}

		this.revenueGuid = revenueGuid;

		this.editForm = this.fb.group({
			nomeConta: ['', Validators.required],
			numeroTitulo: ['', [Validators.required]],
			planoContas: [null, [Validators.required]],
			creditarPara: [null, [Validators.required]],
			nomeLocador: [null, Validators.required],
			formaPagamento: [null, Validators.required],
			dataVencimento: [null, Validators.required],
			valorTitulo: [null, Validators.required],
			valorPagar: [null, Validators.required],
		});

		const { onInputDate, onBlurDate } = Utils.calendarMaskHandlers();
		this.onInputDate = onInputDate;
		this.onBlurDate = onBlurDate;

		this.revenueService
			.getRevenueByGuid(this.revenueGuid)
			.subscribe((event: any) => {
				if (event) {
					const data = event.data[0];
					console.log('Titulo Recebere >> ' + JSON.stringify(data));

					this.revenue = data;

					this.imovelTitulo = data.imoveis[0];
					this.imovel.nome = data.imoveis[0].nome;

					if (data.imoveis[0]?.imovelEndereco[0]) {
						const { rua, bairro, cidade, uf } =
							data.imoveis[0].imovelEndereco[0];
						this.imovel.endereco = `${rua}, ${bairro}, ${cidade} - ${uf}`;
					} else {
						this.imovel.endereco = 'Sem endereço';
					}

					this.editForm.patchValue({
						nomeConta: data.nomeTitulo,
						numeroTitulo: data.numeroTitulo,
						planoContas: +data.tipoTituloReceber?.id ?? null,
						creditarPara: +data.creditoAluguel?.id ?? null,
						nomeLocador: data.cliente.guidReferencia ?? null,
						formaPagamento: +data.formaPagamento?.id ?? null,
						dataVencimento: data.dataVencimentoTitulo
							? new Date(data.dataVencimentoTitulo)
							: null,
						valorTitulo: data.valorTitulo,
						valorPagar: data.valorTitulo,
					});

					setTimeout(() => {
						this.getAnexos();
					}, 40);
				} else {
					this.invalidGuid = true;
				}
				this.isLoading = false;
			});

		this.dominiosService
			.getTiposTitulo()
			.pipe(first())
			.subscribe({
				next: (e: any) => {
					if (e.success) {
						this.opcoesPlanoContas.push(
							...e.data.map((item: any) => {
								return {
									label: item.nome,
									value: item.id,
								};
							})
						);
						this.f['planoContas'].setValue(
							+this.revenue?.tipoTituloReceber?.id ?? null
						);
					} else console.error(e.message);
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.dominiosService
			.getTiposCreditoAluguel()
			.pipe(first())
			.subscribe({
				next: (response) => {
					response?.data.forEach((forma: any) => {
						this.opcoesCreditarPara.push({
							label: forma.nome,
							value: forma.id,
						});
					});
					this.f['creditarPara'].setValue(
						+this.revenue?.creditoAluguel?.id ?? null
					);
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.dominiosService
			.getFormasPagamento()
			.pipe(first())
			.subscribe({
				next: (response) => {
					response.data.forEach((forma: any) => {
						this.opcoesFormaPagamento.push({
							label: forma.nome,
							value: forma.id,
						});
					});
					this.f['formaPagamento'].setValue(
						+this.revenue?.formaPagamento?.id ?? null
					);
				},
				error: (err) => {
					console.error(err);
				},
			});

		this.clienteService
			.getListaProprietarios()
			.pipe(first())
			.subscribe({
				next: (response) => {
					response?.data.forEach((forma: any) => {
						this.opcoesNomeLocador.push({
							label: forma.nome,
							value: forma.guidReferencia,
						});
					});
					this.f['nomeLocador'].setValue(this.revenue?.cliente.guidReferencia);
					console.log('>>>>>>>>>', this.revenue?.cliente.guidReferencia);
				},
				error: (err) => {
					console.error(err);
				},
			});
	}

	getAnexos()
	{
		console.log('GUID IMOVEL > ' + this.imovelTitulo.guidReferencia);
		this.anexoService
			.getFiles(this.imovelTitulo.guidReferencia) 
			.pipe(first())
			.subscribe({
				next: (event) => {
					this.attachmentsObj = {
						capa: event?.find(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'capa'
						),
						foto: event?.filter(
							({ classificacao }: { classificacao: string }) =>
								classificacao === 'foto'
						),
					};

					console.debug('attachmentsObj', this.attachmentsObj);

					if (this.attachmentsObj?.capa)
						this.defaultCoverImage = this.attachmentsObj.capa.local;

					if (this.attachmentsObj?.foto?.length)
						this.expensePhotos = this.attachmentsObj.foto.map((foto) => {
							return {
								name: foto.nome,
								mimetype: foto.mimeType,
								data: foto.local,
								id: foto.id,
							};
						});
				},
				error: (error) => {
					console.error('Erro: ', error);
				},
			});
	}

	get f(): { [key: string]: AbstractControl<any, any> } {
		return this.editForm.controls;
	}

	checkHasError(c: AbstractControl) {
		return Utils.checkHasError(c);
	}

	onSubmit(e: Event) {
		// 		{
		//   "numeroTitulo": "123123154/2023",
		//   "idTipoTitulo": 1,
		//   "idTipoCreditoAluguel": 1,
		//   "guidCliente": "657C89B1-25D1-402E-82F8-BD157D2E57A2",
		//   "idIndiceReajuste": 2,
		//   "idFormaPagamento": 1,
		//   "dataVencimento": "2023-04-10",
		//   "dataPagamento": "2023-04-10",
		//   "valorTitulo": 748.00,
		//   "porcentagemImpostoRetido": 0,
		//   "parcelas": 6,
		//   "lstImoveis": [
		//     {
		//       "guidImovel": "05CA9F97-5A0C-45BE-B02C-91184F4769F6",
		//       "lstUnidades": [
		//         "7d67b442-3f7c-46e8-b6b7-98343aed92c2",
		//         "62e1366f-3292-4af6-85db-c23962c2b2a2"
		//       ]
		//     }
		//   ]
		// }

		console.log('revenue original', this.revenue);
		if (this.editForm.invalid) {
			this.editForm.markAllAsTouched();
			return;
		}

		let formData: {
			nomeConta: string;
			numeroTitulo: string;
			planoContas: number;
			creditarPara: number;
			nomeLocador: string;
			formaPagamento: number;
			dataVencimento: Date;
			valorTitulo: number;
		} = this.editForm.getRawValue();

		const revenueObj: {
			numeroTitulo: string;
			NomeTitulo: string;
			idTipoTitulo: number;
			idTipoCreditoAluguel: number;
			guidCliente: string;
			idIndiceReajuste: number;
			idFormaPagamento: number;
			dataVencimentoPrimeiraParcela: string;
			dataFimTitulo: string;
			valorTitulo: number;
			porcentagemTaxaAdministracao: number;
			parcelas: number;
			lstImoveis: [
				{
					guidImovel: string;
					lstUnidades: [string, string];
				}
			];
		} = {
			numeroTitulo: this.revenue.numeroTitulo,
			NomeTitulo: formData.nomeConta,
			idTipoTitulo: formData.planoContas,
			idTipoCreditoAluguel: formData.creditarPara,
			guidCliente: formData.nomeLocador,
			idIndiceReajuste: this.revenue.indiceReajuste.id,
			idFormaPagamento: formData.formaPagamento,
			dataVencimentoPrimeiraParcela: this.revenue.dataVencimentoPrimeraParcela,
			dataFimTitulo: formData.dataVencimento.toISOString(),
			valorTitulo: formData.valorTitulo,
			porcentagemTaxaAdministracao: this.revenue.porcentagemTaxaAdministracao,
			parcelas: this.revenue.parcelas,
			lstImoveis: this.revenue.imoveis.map((imovel: any) => {
				return {
					guidImovel: imovel.guidReferencia,
					lstUnidades: imovel.unidades.map(
						({ guidReferencia }: any) => guidReferencia
					),
				};
			}),
		};

		console.log('revenueObj Submite >> '+ JSON.stringify(revenueObj));

		this.revenueService
			.updateRevenue(this.revenueGuid, revenueObj)
			.pipe(first())
			.subscribe({
				next: (response: any) => {
					if (response.success) {
						this.modalContent = {
							header: 'Edição realizada com sucesso',
							message: response.message,
						};
					} else {
						this.modalContent = {
							header: 'Edição não realizada',
							message: response.message,
							isError: true,
						};
					}

					this.openModal();
				},
				error: (error: any) => {
					console.error(error);
					this.modalContent = {
						header: 'Edição não realizada',
						message: 'Erro no envio de dados',
						isError: true,
					};

					this.openModal();
				},
			});
	}

	openModal() {
		this.displayModal = true;
	}

	closeModal(onClose?: Function, ...params: any[]) {
		this.displayModal = false;

		if (onClose !== undefined) onClose(...params);
	}

	goBack() {
		this.location.back();
	}

	navigateTo = (route: string) => {
		this.router.navigate([route]);
	};
}
