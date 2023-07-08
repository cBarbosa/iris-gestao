import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { Component, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { Imovel } from 'src/app/shared/models';
import { ExpenseService } from 'src/app/shared/services/expense.service';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
	selector: 'app-expense-view',
	templateUrl: './expense-view.component.html',
	styleUrls: ['./expense-view.component.scss'],
})
export class ExpenseViewComponent {
	property: Imovel | null = null;
	guid: string;
	expense: any;
	imageList: ImageData[] = [];
	isLoadingView = true;

	isMobile: boolean = false;
	displayExpenseDetails = false;
	cardPipes: Record<string, PipeTransform>;

	faturaSelected: any;

	detalheBaixaVisible = false;
	baixaTituloVisible = false;
	edicaoTituloVisible = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private expenseService: ExpenseService,
		private responsiveService: ResponsiveService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.guid = paramMap.get('guid') ?? '';
		});
	}

	ngOnInit(): void {
		this.getByIdExpense();
		// this.getAttachs();

		this.responsiveService.screenWidth$.subscribe((screenWidth) => {
			this.isMobile = screenWidth < 768;
		});

		this.cardPipes = {
			date: new DatePipe('pt-BR', undefined, {
				dateFormat: 'shortDate',
				timezone: '',
			}),
			currency: new CurrencyPipe('pt-BR', 'R$'),
			percent: new PercentPipe('pt-BR'),
		};
	}

	getByIdExpense() {
		this.isLoadingView = true;
		this.expenseService
			.getExpenseByGuid(this.guid)
			.pipe(first())
			.subscribe({
				next: (event: any) => {
					console.log('event', event);
					if (event.success) {
						this.expense = event.data[0];
						this.imageList ||= event.imagens ?? [];
						//console.log('Detalhes Cliente >> ' + JSON.stringify(event));
						// this.properties = [...event.data.imovel];
						event.data[0]?.imoveis &&
							(this.property = event.data[0].imoveis[0] as unknown as Imovel);
					} else {
						this.expense = null;
					}
					this.isLoadingView = false;
				},
				error: (err) => {
					this.expense = null;
					this.isLoadingView = false;
				},
			});

		this.isLoadingView = false;
	}

	setCurrentFatura = (item: any): void => {
		console.log('Fatura Selecionado >> ', item);
		this.faturaSelected = item;
	};

	getFaturaFormData(fatura: any) {
		return {
			guidFatura: fatura?.guidReferencia,
			numeroFatura: fatura?.numeroParcela,
			dataVencimento: fatura?.dataVencimento
				? new Date(fatura?.dataVencimento)
				: null,
			valorTotal: fatura?.valorFatura,
			valorAluguel: fatura?.valorRealPago,
			dataPagamento: fatura?.dataPagamento
				? new Date(fatura?.dataPagamento)
				: null,
			diasAtraso: fatura?.diasAtraso ?? 0,
			observacoes: fatura?.descricaoBaixaFatura,
			anexoNf: 'string',
		};
	}

	showDetalheBaixa = (): void => {
		this.detalheBaixaVisible = true;
		this.baixaTituloVisible = false;
		this.edicaoTituloVisible = false;
	};

	showBaixaTitulo = (): void => {
		this.detalheBaixaVisible = false;
		this.baixaTituloVisible = true;
		this.edicaoTituloVisible = false;
	};

	showEdicaoTitulo = (): void => {
		this.detalheBaixaVisible = false;
		this.baixaTituloVisible = false;
		if (
			this.faturaSelected.statusFatura === 'Vencido' ||
			this.faturaSelected.statusFatura === 'A vencer'
		)
			this.edicaoTituloVisible = true;
		else this.edicaoTituloVisible = false;
	};

	hideDetalheBaixa = () => {
		this.detalheBaixaVisible = false;
	};

	hideBaixaTitulo = () => {
		this.baixaTituloVisible = false;
	};

	hideEdicaoTitulo = () => {
		this.edicaoTituloVisible = false;
	};

	toggleDetalheBaixa() {
		this.displayExpenseDetails = !this.displayExpenseDetails;
	}

	async downloadFile(
		file: File | string | ArrayBuffer | null,
		filename: string
	) {
		if (file instanceof File) {
			file = (await Utils.fileToDataUrl(file)).data;
		}

		if (file === null) return;

		Utils.saveAs(file, filename);
	}

	navigateTo = (route: string): void => {
		this.router.navigate([route]);
	};
}
