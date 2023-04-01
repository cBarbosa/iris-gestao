import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { ContratoAluguel } from '../models/contrato-aluguel.model';
import { IConstrucao } from '../models/construcao.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class ConstructionService {
	constructor(private http: HttpClient) {}

	getConstructions(
		limit: number = 50,
		page: number = 1,
		numeroContrato?: string,
		idTipoConta?: number,
		idTipoImovel?: number,
		idStatus?: number
	) {
		return new Observable((subscriber) => {
			setTimeout(() => {
				subscriber.next({
					success: true,
					message: 'Mock data success',
					data: {
						items: [
							{
								guidReferencia: 'mockguid',
								nomeObra: 'Mock Nome Obra',
								dataInicio: '2023-05-20',
								dataFim: '2024-8-30',
								orcamento: 900000,
								porcentagemConclusao: 70,
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
					idTipoImovel ? `&idTipoImovel=${idTipoImovel}` : ''
				}${idTipoConta ? `&idTipoConta=${idTipoConta}` : ''}${
					idStatus ? `&idStatus=${idStatus}` : ''
				}${numeroContrato ? `&numeroContrato=${numeroContrato}` : ''}`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getConstructions: ${response.message}`);
					return response;
				})
			);
	}

	getConstructionByGuid(constructionGuid: string) {
		return new Observable((subscriber) => {
			setTimeout(() => {
				subscriber.next({
					success: true,
					message: 'Mock data success',
					data: [
						{
							guidReferencia: 'mockguid',
							nomeObra: 'Mock Nome Obra',
							dataInicio: '2023-05-20',
							dataFim: '2024-8-30',
							orcamento: 900000,
							porcentagemConclusao: 70,
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
				});
				subscriber.complete();
			}, 300);
		});

		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Construcao/${constructionGuid}/guid`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getConstructionByGuid: ${response.message}`);
					return response;
				})
			);
	}

	registerConstruction(constructionObj: IConstrucao) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}Construcao/Criar`,
			JSON.stringify(constructionObj, null, 2),
			httpOptions
		);
	}
}
