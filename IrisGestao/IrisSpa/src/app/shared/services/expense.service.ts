import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { IReceita } from '../models/receita.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class ExpenseService {
	constructor(private http: HttpClient) {}

	getExpenses(
		limit: number = 50,
		page: number = 1,
		numeroTitulo?: string,
		idTipoTitulo?: number
	) {
		return new Observable((subscriber) => {
			const mockData = `{
    "message": "Dados carregados com sucesso",
    "success": true,
    "data": {
        "totalCount": 1,
        "page": 1,
        "pageSize": 10,
        "items": [
            {
                "numeroTitulo": "2000000/2023",
                "nomeTitulo": "Título via script",
                "guidReferencia": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "status": true,
                "parcelas": 2,
                "valorTitulo": 102,
                "valorTotalTitulo": 204,
                "dataCriacao": "2023-04-16T20:46:45.653",
                "dataAtualização": "2023-04-16T20:46:45.653",
                "tipoTituloPagar": {
                    "id": 2,
                    "nome": "Taxas de Administração"
                },
                "indiceReajuste": {
                    "id": 1,
                    "nome": "IGPM",
                    "percentual": 1,
                    "dataAtualizacao": "2022-11-21T00:00:00"
                },
                "creditoAluguel": {
                    "id": 1,
                    "nome": "Locador"
                },
                "cliente": {
                    "cpfCnpj": "77263705052",
                    "guidReferencia": "20092388-3703-4a1d-8a27-202d6f2a2bf5",
                    "nome": "Novo Cliente versão final",
                    "razaoSocial": "Novo Cliente versão final"
                },
                "formaPagamento": {
                    "id": 1,
                    "nome": "PIX"
                },
                "imovel": [
                    {
                        "id": 7,
                        "nome": "Edifício Oficial Trade",
                        "guidReferencia": "20767265-c3b7-4681-a679-31b6304cff71",
                        "nroUnidades": 2,
                        "areaTotal": 108426,
                        "areaUtil": 3128,
                        "areaHabitese": 24624,
                        "numCentroCusto": 2604,
                        "imgCapa": "../../../../assets/images/imovel.png",
                        "imagens": [
                            {
                                "thumbUrl": ".../../../assets/images/property/1.jpg",
                                "url": ".../../../assets/images/property/1.jpg"
                            },
                            {
                                "thumbUrl": ".../../../assets/images/property/2.png",
                                "url": ".../../../assets/images/property/2.png"
                            },
                            {
                                "thumbUrl": ".../../../assets/images/property/3.png",
                                "url": ".../../../assets/images/property/3.png"
                            },
                            {
                                "thumbUrl": ".../../../assets/images/property/4.png",
                                "url": ".../../../assets/images/property/4.png"
                            },
                            {
                                "thumbUrl": ".../../../assets/images/property/5.png",
                                "url": ".../../../assets/images/property/5.png"
                            },
                            {
                                "thumbUrl": ".../../../assets/images/property/2.png",
                                "url": ".../../../assets/images/property/2.png"
                            },
                            {
                                "thumbUrl": ".../../../assets/images/property/4.png",
                                "url": ".../../../assets/images/property/4.png"
                            }
                        ],
                        "anexos": [
                            {
                                "nome": "Projeto",
                                "tipo": 1,
                                "fileName": "Projeto.pdf",
                                "uri": "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
                            },
                            {
                                "nome": "Matricula",
                                "fileName": "Matricula.pdf",
                                "tipo": 2,
                                "uri": "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
                            },
                            {
                                "nome": "Habite-se",
                                "fileName": "habite-se.pdf",
                                "tipo": 3,
                                "uri": "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
                            }
                        ],
                        "imovelEndereco": [
                            {
                                "idImovel": 7,
                                "rua": "SEPN 913/713",
                                "complemento": "",
                                "bairro": "Asa SUL",
                                "cidade": "Brasília",
                                "uf": "DF",
                                "cep": 70000000,
                                "dataCriacao": "2022-11-27T15:42:37.77",
                                "dataUltimaModificacao": "2023-03-02T18:43:15.44",
                                "id": 5
                            }
                        ],
                        "ativo": true,
                        "idCategoriaImovelNavigation": {
                            "id": 1,
                            "nome": "Imóvel de carteira"
                        },
                        "idClienteProprietarioNavigation": {
                            "cpfCnpj": "00366770357",
                            "nome": "Confederação Nacional do Comércio de Bens, Serviços e Turismo - CNC",
                            "telefone": "61981171135"
                        },
                        "unidades": [
                            {
                                "id": 49,
                                "guidReferencia": "45714189-181e-44f2-bbee-6d087ef10b32",
                                "idImovel": 7,
                                "areaUtil": 1564,
                                "areaTotal": 54213,
                                "areaHabitese": 12312,
                                "inscricaoIPTU": "654654",
                                "matricula": "56465464",
                                "matriculaEnergia": "564654",
                                "matriculaAgua": "654654",
                                "taxaAdministracao": 654654,
                                "tipo": "Ala Norte",
                                "valorPotencial": 56465,
                                "dataCriacao": "2023-02-07T11:39:10.21",
                                "dataUltimaModificacao": "2023-02-07T11:39:24.123",
                                "ativo": true,
                                "idTipoUnidadeNavigation": {
                                    "id": 1,
                                    "nome": "Edifício Corporativo"
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }
}`;
			subscriber.next(JSON.parse(mockData));
			subscriber.complete();
		});
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}TituloPagar?limit=${limit}&page=${page}${
					numeroTitulo ? `&numeroTitulo=${numeroTitulo}` : ''
				}${idTipoTitulo ? `&idTipoTitulo=${idTipoTitulo}` : ''}`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getExpenses: ${response.message}`);
					return response;
				})
			);
	}

	getExpenseByGuid(expenseGuid: string) {
		return new Observable((subscriber) => {
			const mockData = `{
    "message": "Dados carregados com sucesso",
    "success": true,
    "data": [
        {
            "numeroTitulo": "2000000/2023",
            "nomeTitulo": "Título via script",
            "guidReferencia": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "status": true,
            "parcelas": 2,
            "valorTitulo": 102,
            "valorTotalTitulo": 102,
            "dataCriacao": "2023-04-16T20:46:45.653",
            "dataAtualização": "2023-04-16T20:46:45.653",
            "dataVencimentoPrimeraParcela": "2023-07-10T20:44:26",
            "porcentagemTaxaAdministracao": 0,
            "tipoTituloPagar": {
                "id": 2,
                "nome": "Taxas de Administração"
            },
            "indiceReajuste": {
                "id": 1,
                "nome": "IGPM",
                "percentual": 1,
                "dataAtualizacao": "2022-11-21T00:00:00"
            },
            "creditoAluguel": {
                "id": 1,
                "nome": "Locador"
            },
            "cliente": {
                "cpfCnpj": "77263705052",
                "guidReferencia": "20092388-3703-4a1d-8a27-202d6f2a2bf5",
                "nome": "Novo Cliente versão final",
                "razaoSocial": "Novo Cliente versão final"
            },
            "formaPagamento": {
                "id": 1,
                "nome": "PIX"
            },
            "faturas": [],
            "imoveis": [
                {
                    "id": 7,
                    "nome": "Edifício Oficial Trade",
                    "guidReferencia": "20767265-c3b7-4681-a679-31b6304cff71",
                    "nroUnidades": 2,
                    "areaTotal": 108426,
                    "areaUtil": 3128,
                    "areaHabitese": 24624,
                    "numCentroCusto": 2604,
                    "imgCapa": "../../../../assets/images/imovel.png",
                    "imagens": [
                        {
                            "thumbUrl": ".../../../assets/images/property/1.jpg",
                            "url": ".../../../assets/images/property/1.jpg"
                        },
                        {
                            "thumbUrl": ".../../../assets/images/property/2.png",
                            "url": ".../../../assets/images/property/2.png"
                        },
                        {
                            "thumbUrl": ".../../../assets/images/property/3.png",
                            "url": ".../../../assets/images/property/3.png"
                        },
                        {
                            "thumbUrl": ".../../../assets/images/property/4.png",
                            "url": ".../../../assets/images/property/4.png"
                        },
                        {
                            "thumbUrl": ".../../../assets/images/property/5.png",
                            "url": ".../../../assets/images/property/5.png"
                        },
                        {
                            "thumbUrl": ".../../../assets/images/property/2.png",
                            "url": ".../../../assets/images/property/2.png"
                        },
                        {
                            "thumbUrl": ".../../../assets/images/property/4.png",
                            "url": ".../../../assets/images/property/4.png"
                        }
                    ],
                    "anexos": [
                        {
                            "nome": "Projeto",
                            "tipo": 1,
                            "fileName": "Projeto.pdf",
                            "uri": "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
                        },
                        {
                            "nome": "Matricula",
                            "fileName": "Matricula.pdf",
                            "tipo": 2,
                            "uri": "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
                        },
                        {
                            "nome": "Habite-se",
                            "fileName": "habite-se.pdf",
                            "tipo": 3,
                            "uri": "https://www.angeloni.com.br/files/images/2/1F/AC/manualpdf.pdf"
                        }
                    ],
                    "imovelEndereco": [
                        {
                            "idImovel": 7,
                            "rua": "SEPN 913/713",
                            "complemento": "",
                            "bairro": "Asa SUL",
                            "cidade": "Brasília",
                            "uf": "DF",
                            "cep": 70000000,
                            "dataCriacao": "2022-11-27T15:42:37.77",
                            "dataUltimaModificacao": "2023-03-02T18:43:15.44",
                            "id": 5
                        }
                    ],
                    "ativo": true,
                    "idCategoriaImovelNavigation": {
                        "id": 1,
                        "nome": "Imóvel de carteira"
                    },
                    "idClienteProprietarioNavigation": {
                        "cpfCnpj": "00366770357",
                        "nome": "Confederação Nacional do Comércio de Bens, Serviços e Turismo - CNC",
                        "telefone": "61981171135"
                    },
                    "unidades": [
                        {
                            "id": 49,
                            "guidReferencia": "45714189-181e-44f2-bbee-6d087ef10b32",
                            "idImovel": 7,
                            "areaUtil": 1564,
                            "areaTotal": 54213,
                            "areaHabitese": 12312,
                            "inscricaoIPTU": "654654",
                            "matricula": "56465464",
                            "matriculaEnergia": "564654",
                            "matriculaAgua": "654654",
                            "taxaAdministracao": 654654,
                            "tipo": "Ala Norte",
                            "valorPotencial": 56465,
                            "dataCriacao": "2023-02-07T11:39:10.21",
                            "dataUltimaModificacao": "2023-02-07T11:39:24.123",
                            "ativo": true,
                            "idTipoUnidadeNavigation": {
                                "id": 1,
                                "nome": "Edifício Corporativo"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}`;
			subscriber.next(JSON.parse(mockData));
			subscriber.complete();
		});
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}TituloReceber/${expenseGuid}/guid`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getExpenseByGuid: ${response.message}`);
					return response;
				})
			);
	}

	registerExpense(expenseObj: IReceita) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}TituloPagar/Criar`,
			JSON.stringify(expenseObj, null, 2),
			httpOptions
		);
	}

	updateExpense(guid: string, receita: IReceita) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}TituloPagar/${guid}/atualizar`,
			JSON.stringify(receita, null, 2),
			httpOptions
		);
	}

	baixarParcela(
		guid: string,
		baixaObj: {
			dataVencimento: string;
			dataPagamento: string;
			valorRealPago: number;
			DescricaoBaixaFatura: string;
		}
	) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}FaturaTitulo/${guid}/atualizar`,
			JSON.stringify(baixaObj, null, 2),
			httpOptions
		);
	}
}
