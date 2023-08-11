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
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}TituloPagar/${expenseGuid}/guid`)
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
			`${env.config.apiUrl}FaturaTituloPagar/${guid}/baixarFatura`,
			JSON.stringify(baixaObj, null, 2),
			httpOptions
		);
	}

	editarFatura(
		guid: string,
		faturaObj: {
			valor: number;
			dataVencimento: string;
		}
	) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}FaturaTituloPagar/${guid}/atualizar`,
			JSON.stringify(faturaObj, null, 2),
			httpOptions
		);
	}
	
	adicionarFatura(
		guid: string,
		faturaObj: {
			valor: number;
			dataVencimento: string;
		}
	) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}FaturaTituloPagar/${guid}/criar`,
			JSON.stringify(faturaObj, null, 2),
			httpOptions
		);
	}
}
