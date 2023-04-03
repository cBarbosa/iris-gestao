import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { IConstrucao } from '../models/construcao.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class RevenueService {
	constructor(private http: HttpClient) {}

	getRevenues(
		limit: number = 50,
		page: number = 1,
		titulo?: string,
		idLocatario?: number,
		idRecebimento?: number
	) {
		return new Observable((subscriber) => {
			setTimeout(() => {
				subscriber.next({
					success: true,
					message: 'Mock data success',
					data: {
						totalCount: 1,
						items: [
							{
								guidReferencia: 'mockguid',
								tipoRecebimento: 'Mock Nome da receita',
								numeroTitulo: '100000/2023',
								dataPagamento: '2024-8-30',
								valor: 3000,
								locatario: 'Mock Vieira Neto',
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
								servicos: [
									{
										guidReferencia: 'mockguidservico',
										nomeServico: 'Nome serviço Mock',
										numeroNF: '0000100010101234',
										dataEmissao: '2025-09-21',
										valorEstimado: 50000,
										valorContratado: 45000,
										valorLiquido: 55000,
										saldo: 120000,
										TAObra: 0.1,
										notaFiscal: true,
										nfFile: {
											name: 'Nota Fiscal mock',
											url: 'https://url.teste.mock/mocknotafiscal',
										},
									},
									{
										guidReferencia: 'mockguidservico2',
										nomeServico: 'Nome serviço 2 Mock',
										numeroNF: '0020200010201298',
										dataEmissao: '2023-02-10',
										valorEstimado: 70000,
										valorContratado: 65000,
										valorLiquido: 80000,
										saldo: 100000,
										TAObra: 0.2,
										notaFiscal: false,
										nfFile: {
											name: 'Nota Fiscal mock 2',
											url: 'https://url.teste.mock/mocknotafiscal2',
										},
									},
								],
							},
						],
					},
				});
				subscriber.complete();
			}, 300);
		});

		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Construcao?limit=${limit}&page=${page}${
					titulo ? `&titulo=${titulo}` : ''
				}${idLocatario ? `&idLocatario=${idLocatario}` : ''}${
					idRecebimento ? `&idRecebimento=${idRecebimento}` : ''
				}`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getRevenues: ${response.message}`);
					return response;
				})
			);
	}

	getRevenueByGuid(revenueGuid: string) {
		return new Observable((subscriber) => {
			setTimeout(() => {
				subscriber.next({
					success: true,
					message: 'Mock data success',
					data: [
						{
							guidReferencia: 'mockguid',
							tipoRecebimento: 'Mock Nome da receita',
							numeroTitulo: '100000/2023',
							classificacao: 'IPTU',
							creditarPara: 'Administradora',
							dataPagamento: '2024-8-30',
							formaPagamento: 'Boleto',
							valor: 3000,
							valorTitulo: 3000,
							locatario: 'Mock Vieira Neto',
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
							faturas: [
								{
									guidReferencia: 'mockguidfatura',
									numeroFatura: '0000100010101234',
									dataPagamento: '2025-09-21',
									dataVencimento: '2025-09-21',
									valor: 300000,
									valorAluguel: 5000,
									valorLiquido: 55000,
									impostosRetidos: 0.12,
									diasAtraso: 3,
									emitido: false,
									nfFile: {
										name: 'Nota Fiscal mock',
										url: 'https://url.teste.mock/mocknotafiscal',
									},
								},
								{
									guidReferencia: 'mockguidfatura',
									numeroFatura: '00002000101010101',
									dataPagamento: '2025-09-21',
									dataVencimento: '2025-09-21',
									valor: 400000,
									valorAluguel: 4400,
									valorLiquido: 59000,
									impostosRetidos: 0.1,
									diasAtraso: 2,
									emitido: true,
									nfFile: {
										name: 'Nota Fiscal 2 mock',
										url: 'https://url.teste.mock/mocknotafiscal',
									},
								},
							],
						},
					],
				});
				subscriber.complete();
			}, 300);
		});

		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Construcao/${revenueGuid}/guid`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getRevenueByGuid: ${response.message}`);
					return response;
				})
			);
	}

	registerRevenue(revenueObj: IConstrucao) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}Construcao/Criar`,
			JSON.stringify(revenueObj, null, 2),
			httpOptions
		);
	}
}
