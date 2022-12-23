import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';

type Property = {
	Nome: string;
	IdCategoriaImovel: number;
	IdClienteProprietario: number;
	NumCentroCusto: number;
	MonoUsuario: boolean;
	Classificacao: null;
	GuidReferencia: null;
};

type Unit = {
	Tipo: string;
	IdTipoUnidade: number;
	AreaUtil: number;
	AreaTotal: number;
	AreaHabitese: number;
	Matricula: string;
	InscricaoIptu: string;
	MatriculaEnergia: string;
	MatriculaAgua: string;
	TaxaAdministracao: number;
	ValorPotencial: number;
	UnidadeLocada: boolean;
};

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json',
	}),
};

@Injectable({
	providedIn: 'root',
})
export class ImovelService {
	constructor(private http: HttpClient) {}

	getProperties(limit: number = 50, page: number = 1) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Imovel?limit=${limit}&page=${page}`
			)
			.pipe(
				map((response) => {
					console.log('response', response);
					if (response.success) return response.data;
					else return console.error(`getPerperties: ${response.message}`);
				})
			);
	}

	registerProperty(propertyObj: Property) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}Imovel/Criar`,
			JSON.stringify(propertyObj, null, 2),
			httpOptions
		);
		// .pipe(map(response => {
		// 	console.log('response', response)
		// 	return response
		// }))
	}

	registerUnit(unitObj: Unit, guid: string) {
		return this.http.post<ApiResponse>(
			`${env.config.apiUrl}Unidade/${guid}/Criar`,
			JSON.stringify(unitObj, null, 2),
			httpOptions
		);
	}
  
	};

	getProperty(uid: string) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Imovel/${uid}/guid`
			)
			.pipe(
				map((response) => {
					console.log('response', response);
					if (response.success) return response.data;
					else return console.error(`getPerperties: ${response.message}`);
				})
			);
	};

	getUnit(uid: string) {
		return this.http
			.get<ApiResponse>(
				`${env.config.apiUrl}Unidade/${uid}/guid`
			)
			.pipe(
				map((response) => {
					console.log('response', response);
					if (response.success) return response.data;
					else return console.error(`getUnit: ${response.message}`);
				})
			);
	};
}
