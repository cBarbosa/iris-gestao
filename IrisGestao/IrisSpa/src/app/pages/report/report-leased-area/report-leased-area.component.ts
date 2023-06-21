import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { ResponsiveService } from 'src/app/shared/services/responsive-service.service';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-report-leased-area',
  templateUrl: './report-leased-area.component.html',
  styleUrls: ['./report-leased-area.component.scss']
})
export class ReportLeasedAreaComponent {

  isLoading:boolean = false;
  isMobile: boolean = false;
  displayMobileFilters: boolean = false;
  totalAreaCount: number;
  noRestults:boolean = false;
  filterText:string = '';
  resultEntries: any[];

  first = 0;
	rows = 10;
	pageIndex = 1;

  constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private responsiveService: ResponsiveService
	) { };

  ngOnInit(): void {
    
  };

  filterResult = (e?: Event, page: number = 1, stack: boolean = false) => {
		console.log(e);

		// if (stack) return this.getPage(page, this.filterText);
		// else return this.setEntries(page, this.filterText);
	};

  loadResultPage(event: LazyLoadEvent): void {
		if (event.first != null) {
			const page = Math.floor(event.first / this.rows) + 1;
			this.filterResult(undefined, page);
			this.scrollTop();
		}
	}

  filterResultDebounce: Function = Utils.debounce(
		this.filterResult,
		1000
	);

  openFilters() {
		this.displayMobileFilters = true;
	}

  scrollTop() {
		window.scroll({
			top: 0,
			left: 0,
		});
	}
}
