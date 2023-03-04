import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Imovel } from 'src/app/shared/models';
import { SupplierContractService } from 'src/app/shared/services/supplier-contract.service';

@Component({
	selector: 'app-supplier-contract-view',
	templateUrl: './supplier-contract-view.component.html',
	styleUrls: ['./supplier-contract-view.component.scss'],
})
export class SupplierContractViewComponent {
	property: Imovel | null = null;
	guid: string;
	contract: any;
	isLoadingView = false;
	isCnpj: boolean = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private contractService: SupplierContractService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.guid = paramMap.get('guid') ?? '';
		});
	}

	ngOnInit(): void {
		this.getByIdContract();
	}

	getByIdContract() {
		this.isLoadingView = true;
		this.contractService
			.getContractByGuid(this.guid)
			.pipe(first())
			.subscribe({
				next: (event) => {
					console.log('event', event);
					if (event.success) {
						this.contract = event.data[0];
						this.isCnpj = event.data[0].fornecedor.cpfCnpj.length > 11;
						//console.log('Detalhes Cliente >> ' + JSON.stringify(event));
						// this.properties = [...event.data.imovel];
						this.property = event.data[0].imovel as unknown as Imovel;
					} else {
						this.contract = null;
					}
					this.isLoadingView = false;
				},
				error: (err) => {
					this.contract = null;
					this.isLoadingView = false;
				},
			});

		/*
		const event = {
			message: 'Dados carregados com sucesso',
			success: true,
			data: [
				{
					numeroContrato: '180586/2023',
					percentual: 10,
					dataAtualizacao: '2023-02-13T00:00:00',
					valorServicoContratado: 26500,
					dataInicioContrato: '2023-02-01T00:00:00',
					prazoTotalMeses: 0,
					dataFimContrato: '2024-02-01T00:00:00',
					diaPagamento: 10,
					periodicidadeReajuste: 32,
					guidReferencia: '003b8b38-8c77-4b24-81d2-93975eabef6b',
					dataCriacao: '2023-02-13T23:15:38.74',
					dataAtualização: '2023-02-13T23:15:39.3',
					status: true,
					descricaoServico: 'Serviço de conservação predial',
					exibirAlertaVencimento: false,
					imgCapa: '../../../../assets/images/imovel.png',
					imagens: [
						{
							thumbUrl: '.../../../assets/images/property/1.jpg',
							url: '.../../../assets/images/property/1.jpg',
						},
						{
							thumbUrl: '.../../../assets/images/property/2.png',
							url: '.../../../assets/images/property/2.png',
						},
						{
							thumbUrl: '.../../../assets/images/property/3.png',
							url: '.../../../assets/images/property/3.png',
						},
						{
							thumbUrl: '.../../../assets/images/property/4.png',
							url: '.../../../assets/images/property/4.png',
						},
						{
							thumbUrl: '.../../../assets/images/property/5.png',
							url: '.../../../assets/images/property/5.png',
						},
						{
							thumbUrl: '.../../../assets/images/property/2.png',
							url: '.../../../assets/images/property/2.png',
						},
						{
							thumbUrl: '.../../../assets/images/property/4.png',
							url: '.../../../assets/images/property/4.png',
						},
					],
					anexos: [
						{
							nome: 'Projeto',
							tipo: 1,
							fileName: 'Projeto.pdf',
							uri: 'https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf',
						},
						{
							nome: 'Matricula',
							fileName: 'Matricula.pdf',
							tipo: 2,
							uri: 'https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf',
						},
						{
							nome: 'Habite-se',
							fileName: 'habite-se.pdf',
							tipo: 3,
							uri: 'https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf',
						},
					],
					imovel: {
						guidReferencia: '05ca9f97-5a0c-45be-b02c-91184f4769f6',
						nome: 'Edifício CNC',
						numCentroCusto: 987536412,
						status: true,
						areaTotal: 1380,
						areaUtil: 0,
						areaHabitese: 1200,
						nroUnidades: 6,
						imovelEndereco: [
							{
								idImovel: 1005,
								rua: 'EQS 414/415',
								complemento: '',
								bairro: 'Asa Sul',
								cidade: 'Brasília',
								uf: 'DF',
								cep: 70297400,
								dataCriacao: '2023-01-21T18:31:09.34',
								dataUltimaModificacao: '2023-01-21T18:31:09.34',
								id: 1003,
							},
						],
						idCategoriaImovelNavigation: {
							id: 1,
							nome: 'Imóvel de carteira',
						},
					},
					indiceReajuste: {
						id: 2,
						nome: 'IPCA',
						percentual: 0,
						dataAtualizacao: '2023-01-13T00:00:00',
					},
					formaPagamento: {
						id: 4,
						nome: 'DOC',
					},
					fornecedor: {
						guidReferencia: '7f60724d-5601-4ac8-8aa1-588f88457ac8',
						nome: 'Segurança Patrimonial v2',
						cpfCnpj: '55642822000168',
						razaoSocial: 'Segurança Patrimonial ME',
						dataUltimaModificacao: '2023-02-05T18:38:44.36',
						dataCriacao: '2023-01-30T22:19:55.357',
						cep: 70772000,
						endereco: 'Quadra SQN 115',
						bairro: 'Asa Norte',
						cidade: 'Brasília',
						estado: 'DF',
						dadoBancario: {
							agencia: 1234,
							operacao: 13,
							dadoBancario: 'Nubank',
							conta: 986587,
							chavePix: '01895845130',
							dataCriacao: '2023-01-30T22:19:57.293',
						},
						contato: [
							{
								nome: 'Segurança Patrimonial ',
								cargo: 'Executivo',
								email: 'renato.s.almeida@outlook.com',
								telefone: '61991363588',
								dataNascimento: '1988-04-26T00:00:00',
								dataCriacao: '2023-01-30T22:20:17.067',
								dataAtualização: '2023-01-30T22:20:17.067',
								guidReferenciaContato: '0d33d807-fb16-4ec5-80f6-8fdcc931c0cc',
							},
							{
								nome: 'Arquiteto contato',
								cargo: 'Arquiteto',
								email: 'renatin.bsi@gmail.com',
								telefone: '61991363588',
								dataNascimento: '1980-01-01T00:00:00',
								dataCriacao: '2023-02-13T23:18:51.987',
								dataAtualização: '2023-02-13T23:18:51.987',
								guidReferenciaContato: '678dcb7b-7bdd-4bcf-b9b5-ef73cd3856d9',
							},
						],
					},
				},
			],
		};
		// */
		// this.contract = event.data[0];
		// this.isCnpj = event.data[0].fornecedor.cpfCnpj.length > 11;

		// this.property = event.data[0].imovel as unknown as Imovel;

		this.isLoadingView = false;
	}

	downloadFile(uri: string) {}

	navigateTo = (route: string): void => {
		this.router.navigate([route]);
	};
}
