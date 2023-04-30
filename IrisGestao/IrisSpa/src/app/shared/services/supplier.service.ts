import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { Fornecedor } from '../models/fornecedor.model';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class SupplierService {
	constructor(private http: HttpClient) {}

	getSuppliers(limit: number = 50, page: number = 1) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Fornecedor?limit=${limit}&page=${page}`
			)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getSuppliers: ${response.message}`);
					return response;
				})
			);
	}

	getSupplierByGuid(guid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Fornecedor/${guid}/guid`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getSupplierByGuid: ${response.message}`);
					return response;
				})
			);
	}

	registerSupplier(supplierObj: Fornecedor) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}Fornecedor/Criar`,
			JSON.stringify(supplierObj, null, 2),
			httpOptions
		);
	}
}
