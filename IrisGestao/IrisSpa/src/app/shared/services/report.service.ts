import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map} from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

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

type RentValue = {
	nomeImovel: string;
	numCentroCusto: number;
	nomeLocatario: string;
	somaAreaUtil: number;
	somaValorAluguel: number;
	somaPrecoM2: number;
	somaValorPotencial: number;
	precoMesReferencia: number;
};

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'multipart/form-data',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class ReportService {
	
	constructor(private http: HttpClient) { };

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
					IdLocatario: locatarioId ?? '',
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
	};

	getRentValue(
		imovelId?: number,
		status?: boolean,
		tipoImovelId?: number,
		locatarioId?: number,
		locadorId?: number,
		dateRef?: string
	) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/rent-value`, {
				params: {
					Status: status ?? '',
					IdImovel: imovelId ?? '',
					IdTipoImovel: tipoImovelId ?? '',
					IdLocatario: locatarioId ?? '',
					IdLocador: locadorId ?? '',
					DateRef: dateRef ?? ''
				},
			})
			.pipe(
				map((response): RentValue[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getRentValue: ${response.message}`);
					return response.data;
				})
			);
	};

	getSupplyContract(
		imovelId: number | undefined,
		status: boolean | undefined,
		tipoImovelId: number | undefined,
		locatarioId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/supply-contract`, {
				params: {
					Status: status ?? '',
					IdImovel: imovelId ?? '',
					IdTipoImovel: tipoImovelId ?? '',
					IdLocatario: locatarioId ?? '',
					IdLocador: locadorId ?? ''
				},
			})
			.pipe(
				map((response): RentValue[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getRentValue: ${response.message}`);
					return response.data;
				})
			);
	};

}
