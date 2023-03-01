import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models';
import { ContratoAluguel } from 'src/app/shared/models/contrato-aluguel.model';
import { RentContractService } from 'src/app/shared/services/rent-contract.service';

@Component({
	selector: 'app-rent-contract-view',
	templateUrl: './rent-contract-view.component.html',
	styleUrls: ['./rent-contract-view.component.scss'],
})
export class RentContractViewComponent {
	contract: any;
	isLoadingView = false;
	guid: string;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private rentContractService: RentContractService
	) {
		this.route.paramMap.subscribe((paramMap) => {
			this.guid = paramMap.get('guid') ?? '';
		});
	}

	ngOnInit() {
		console.log(this.guid);
		this.getData();
	}

	getData(): void {
		this.isLoadingView = true;

		const view = this.rentContractService
			.getContractByGuid(this.guid)
			?.pipe(first())
			.subscribe((response: ApiResponse) => {
				this.contract = response.data[0];

				console.log(this.contract);
				// this.property = imovel;
				// this.units = imovel.unidade!;
				// this.imageList = imovel.imagens!;
				this.isLoadingView = false;
				// this.isCorporativeBuilding =
				// 	this.units[0].idTipoUnidadeNavigation?.id == 1;
			});
	}

	unitReduce(units: any) {
		const formatted = units.reduce((acc: string, u: any) => {
			return acc + u.idUnidae + ', ';
		}, '');
		return formatted.slice(0, -2);
	}

	navigateTo(route: string) {
		this.router.navigate([route]);
	}
}
