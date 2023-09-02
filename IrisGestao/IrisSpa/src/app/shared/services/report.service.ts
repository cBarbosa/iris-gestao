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
	valorAluguel: number;
	valorPotencial: number;
	precoM2: number;
	precoM2Referencia: number;
	precoM2ReferenciaJan: number;
};

type SupplyContract = {
	imovel: string;
	locatario: string;
	locador: string;
	percUltimoReajuste: string;
	inicioContrato: Date;
	fimContrato: Date;
	proxReajuste: Date;
	perdDesconto: string;
	prazoDesconto: number;
	carencia: boolean;
	prazoCarencia: number;
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
		locadorId?: number
	) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/leased-area`, {
				params: {
					IdImovel: imovelId ?? '',
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
		locatarioId?: number,
		locadorId?: number,
		dateRef?: string
	) {
		return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/rent-value`, {
				params: {
					IdImovel: imovelId ?? '',
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
		locatarioId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/supply-contract`, {
				params: {
					IdImovel: imovelId ?? '',
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
		locatarioId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/expenses`, {
				params: {
					DateRefInit,
					DateRefEnd,
					IdImovel: imovelId ?? '',
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
		locatarioId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/Revenues`, {
				params: {
					DateRefInit,
					DateRefEnd,
					IdImovel: imovelId ?? '',
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
		locadorId: number | undefined,
		locatarioId: number | undefined
		) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/Dimob`, {
				params: {
					DateRefInit,
					DateRefEnd,
					IdLocador: locadorId ?? '',
					IdLocatario: locatarioId ?? ''
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

	getRentContract(
		imovelId: number | undefined,
		locadorId: number | undefined) {
			return this.http
			.get<ApiResponse>(`${env.config.apiUrl}Report/rent-contract`, {
				params: {
					IdImovel: imovelId ?? '',
					IdLocador: locadorId ?? ''
				},
			})
			.pipe(
				map((response): SupplyContract[] | null => {
					console.debug('response', response);
					if (!response.success)
						console.error(`getRentContract: ${response.message}`);
					return response.data;
				})
			);
	};

}
