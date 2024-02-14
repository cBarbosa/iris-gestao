import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { environment as env } from '../../../environments/environment';
import { ImovelUnidadeType } from '../models';

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

	getProperties(
		limit: number = 50,
		page: number = 1,
		filter?: string,
		categoryId?: number,
		proprietaryId?: number,
		propertyTypeId?: number
	) {
		const requestPath = `${
			env.config.apiUrl
		}Imovel?limit=${limit}&page=${page}${
			propertyTypeId ? `&idTipoImovel=${propertyTypeId}` : ''
		}${filter ? `&nome=${filter}` : ''}${
			categoryId ? `&idCategoria=${categoryId}` : ''
		}${proprietaryId ? `&idProprietario=${proprietaryId}` : ''}`;

		return this.http.get<ApiResponse>(requestPath).pipe(
			map((response) => {
				if (!response.success)
					console.error(`getProperties: ${response.message}`);
				return response;
			})
		);
	}

	getImoveisDisponiveis() {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Imovel/BuscarImoveisDisponiveis`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getProperty: ${response.message}`);
					return response.data;
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

	getProperty(uid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Imovel/${uid}/guid`)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`getProperty: ${response.message}`);
					return response.data;
				})
			);
	}

	updateProperty(uid: string, property: any) {
		return this.http
			.put<ApiResponse>(`${env.config.apiUrl}Imovel/${uid}/atualizar`, property)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`updateProperty: ${response.message}`);
					return response;
				})
			);
	}

	getUnit(uid: string) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Unidade/${uid}/guid`)
			.pipe(
				map((response) => {
					if (response.success) return response.data;
					else return console.error(`getUnit: ${response.message}`);
				})
			);
	}

	saveUnit(uid: string, unit: ImovelUnidadeType) {
		return this.http
			.put<ApiResponse>(`${env.config.apiUrl}Unidade/${uid}/atualizar`, unit)
			.pipe(
				map((response) => {
					if (!response.success) console.error(`getUnit: ${response.message}`);
					return response;
				})
			);
	}

	createUnit(uid: string, unit: ImovelUnidadeType) {
		return this.http
			.post<ApiResponse>(`${env.config.apiUrl}Unidade/${uid}/criar`, unit)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`createUnit: ${response.message}`);
					return response;
				})
			);
	}

	cloneUnit(uid: string) {
		return this.http
			.put<ApiResponse>(`${env.config.apiUrl}Unidade/${uid}/duplicar`, null)
			.pipe(
				map((response) => {
					if (!response.success)
						console.error(`cloneUnit: ${response.message}`);
					return response;
				})
			);
	}

	inactiveUnit(uid: string, status: boolean) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}Unidade/${uid}/${status}/alterar-status`,
			httpOptions
		);
	}

	inactiveImovel(uid: string, status: boolean) {
		return this.http.put<ApiResponse>(
			`${env.config.apiUrl}Imovel/${uid}/${status}/alterar-status`,
			httpOptions
		);
	}
}
