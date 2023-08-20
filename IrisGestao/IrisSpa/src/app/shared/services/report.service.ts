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
	imovel: string;
	centroDeCusto: number;
	locador: string;
	locatario: string;
	areaTotalSelecionada: number;
	valorPotencial: number;
	precoM2: number;
	precoM2Referencia: number;
	precoM2ReferenciaJan: number;
};

type SupplyContract = {
	nomeImovel: string;
	nomeLocador: string;
	baseReajuste: string
	inicioContrato: Date;
	fimContrato: Date;
	proximaAtualizacao: Date;
};

type Expenses = {
	dataVencimento: Date;
	valor: number;
	valorRealPago: number;
	valorTitulo: number;
	valorTotalTitulo: number;
	nomeTitulo: string;
	nomeDocumento: string;
	nomeImovel: string;
};

type Revenues = {
	dataVencimento: Date;
	dataBaixa: Date;
	valorBaixa: number;
	valorDesconto: number;
	valorLiquido: number;
	nomeCliente: string;
	nomeTitulo: string;
	nomeDocumento: string;
};

type Dimob = {
	Locador: string;
	mesReferencia: string;
	valorAluguel: number;
	vencimentoAluguel: Date;
	dataRecebimento: Date;
	valorBruto: number;
	valorLiquido: number;
	vencimentoPagamento: Date;
	dataPagamento: Date;
};

type Commercials = {
	locador: string;
	cpfCnpj: string;
	// contato: string;
	email: string;
	telefone: string;
	imovel: string;
	nomeEvento: string;
	descricao: string;
	dthRealizacao: Date;
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
				map((response): SupplyContract[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getSupplyContract: ${response.message}`);
					return response.data;
				})
			);
	};

	getCosts(
		DateRefInit: string,
		DateRefEnd: string,
		imovelId: number | undefined,
		status: boolean | undefined,
		tipoImovelId: number | undefined,
		locatarioId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/expenses`, {
				params: {
					DateRefInit,
					DateRefEnd,
					Status: status ?? '',
					IdImovel: imovelId ?? '',
					IdTipoImovel: tipoImovelId ?? '',
					IdLocatario: locatarioId ?? '',
					IdLocador: locadorId ?? ''
				},
			})
			.pipe(
				map((response): Expenses[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getCosts: ${response.message}`);
					return response.data;
				})
			);
	};

	getReceipts(
		DateRefInit: string,
		DateRefEnd: string,
		imovelId: number | undefined,
		status: boolean | undefined,
		tipoImovelId: number | undefined,
		locatarioId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/Revenues`, {
				params: {
					DateRefInit,
					DateRefEnd,
					Status: status ?? '',
					IdImovel: imovelId ?? '',
					IdTipoImovel: tipoImovelId ?? '',
					IdLocatario: locatarioId ?? '',
					IdLocador: locadorId ?? ''
				},
			})
			.pipe(
				map((response): Revenues[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getReceipts: ${response.message}`);
					return response.data;
				})
			);
	};

	getDimob(
		DateRefInit: string,
		DateRefEnd: string,
		locatarioId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/Dimob`, {
				params: {
					DateRefInit,
					DateRefEnd,
					IdLocatario: locatarioId ?? '',
					IdLocador: locadorId ?? ''
				},
			})
			.pipe(
				map((response): Dimob[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getDimob: ${response.message}`);
					return response.data;
				})
			);
	};

	getCommercial(
		DateRefInit: string,
		DateRefEnd: string,
		ImovelId: number | undefined,
		locatarioId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/Commercial`, {
				params: {
					DateRefInit,
					DateRefEnd,
					IdImovel: ImovelId ?? '',
					IdLocatario: locatarioId ?? '',
					IdLocador: locadorId ?? ''
				},
			})
			.pipe(
				map((response): Commercials[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getCommercial: ${response.message}`);
					return response.data;
				})
			);
	};

}
