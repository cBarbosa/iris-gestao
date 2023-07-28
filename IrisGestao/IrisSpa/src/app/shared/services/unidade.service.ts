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
export class UnidadeService {
	constructor(private http: HttpClient) {}

	getUnit() {
		return this.http.get<ApiResponse>(`${env.config.apiUrl}Unidade`).pipe(
			map((response) => {
				if (!response.success) console.error(`getUnidade: ${response.message}`);
				return response;
			})
		);
	}

	getUnitByGuid(guid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Unidade/${guid}/guid`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getUnitByGuid: ${response.message}`);
					return response;
				})
			);
	}

	getUnitByPropertyId(guid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Unidade/${guid}/idImovel`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getUnitByPropertyId: ${response.message}`);
					return response;
				})
			);
	}

	deleteUnit(codigo: string) {
		return this.http.delete<ApiResponse>(
			`${env.config.apiUrl}Contato/${codigo}/deletar`
		);
	}
}
