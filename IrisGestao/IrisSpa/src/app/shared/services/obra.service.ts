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
		nome?: string,
		idCategoria?: number,
		idProprietario?: number
	) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Obra?limit=${limit}&page=${page}${
					idProprietario ? `&idProprietario=${idProprietario}` : ''
				}${idCategoria ? `&idCategoria=${idCategoria}` : ''}${
					nome ? `&nome=${nome}` : ''
				}`
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
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Obra/${constructionGuid}/guid`)
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
			`${env.config.apiUrl}Obra`,
			JSON.stringify(constructionObj, null, 2),
			httpOptions
		);
	}

	updateConstruction(
		guid: string,
		constructionObj: {
			Nome: string;
			DataInicio: string;
			DataPrevistaTermino: string;
			Percentual: number;
			ValorOrcamento: number;
		}
	) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}Obra/${guid}`,
			JSON.stringify(constructionObj, null, 2),
			httpOptions
		);
	}

	registerConstructionInvoice(
		constructionGuid: string,
		invoiceObj: {
			IdTipoServico: number;
			NumeroNota: string;
			DataEmissao: string;
			DataVencimento: string;
			ValorServico: number;
			ValorOrcado: number;
			ValorContratado: number;
			Percentual: number;
		}
	) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}Obra/${constructionGuid}/notafiscal`,
			JSON.stringify(invoiceObj, null, 2),
			httpOptions
		);
	}

	updateConstructionInvoice(
		guid: string,
		invoiceObj: {
			IdTipoServico: number;
			NumeroNota: string;
			DataEmissao: string;
			DataVencimento: string;
			ValorServico: number;
			ValorOrcado: number;
			ValorContratado: number;
			Percentual: number;
		}
	) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}Obra/notafiscal/${guid}`,
			JSON.stringify(invoiceObj, null, 2),
			httpOptions
		);
	}

	getConstructionInvoiceByGuid(invoiceGuid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Obra/notafiscal/${invoiceGuid}`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getConstructionInvoiceByGuid: ${response.message}`);
					return response;
				})
			);
	}
}
