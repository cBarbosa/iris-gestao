import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

import { first } from 'rxjs/internal/operators/first';

type LeasedArea = {
	nomeImovel: string;
	numCentroCusto: number;
	nomeLocatario: string;
	somaAreaTotal: number;
	somaAreaUtil: number;
	somaAreaHabitese: number;
	somaValorAluguel: number;
	somaValorPotencial: number;
};

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'multipart/form-data',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class ReportLeasedAreaService {
	constructor(private http: HttpClient) {}

	getLeasedArea(
		imovelId?: number,
		status?: boolean,
		tipoImovelId?: number,
		locatarioId?: number,
		locadorId?: number
	) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/leased-area`, {
				params: {
					Status: status ?? '',
					IdImovel: imovelId ?? '',
					IdTipoImovel: tipoImovelId ?? '',
					IdLocatario: locadorId ?? '',
					IdLocador: locadorId ?? '',
				},
			})
			.pipe(
				map((response): LeasedArea[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getLeasedArea: ${response.message}`);
					return response.data;
				})
			);
	}
}
