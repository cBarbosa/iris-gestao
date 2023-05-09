import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class FornecedorService {
	constructor(private http: HttpClient) {}

	getSuppliers(limit: number = 50, page: number = 1, filter?: string) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Fornecedor?limit=${limit}&page=${page}${
					filter ? `&nome=${filter}` : ''
				}`
			)
			.pipe(
				map((response) => {
					console.log('suppliers response', response);
					if (!response.success)
						console.error(`suppliers: ${response.message}`);
					return response;
				})
			);
	}

	getSupplierById(uid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Fornecedor/${uid}/guid`)
			.pipe(
				map((response) => {
					console.log('supplier response', response);
					if (response.success) return response.data;
					else return console.error(`getSupplier: ${response.message}`);
				})
			);
	}

	createSupplier(form: any) {
		return this.http
			.post<ApiResponse>(
				`${env.config.apiUrl}Fornecedor/Criar`,
				JSON.stringify(form, null, 2),
				httpOptions
			)
			.pipe(
				map((response) => {
					console.log('supplier response', response);
					if (response) return response;
					else return console.error(`createSupplier: ${response}`);
				})
			);
	}

	updateSupplier(uid: string, form: any) {
		return this.http
			.put<ApiResponse>(
				`${env.config.apiUrl}Fornecedor/${uid}/atualizar`,
				JSON.stringify(form, null, 2),
				httpOptions
			)
			.pipe(
				map((response) => {
					console.log('client response', response);
					if (response.success) return response;
					else return console.error(`getClients: ${response.message}`);
				})
			);
	}
}
