import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'app-icon',
	templateUrl: './icon.component.html',
	styleUrls: ['./icon.component.scss'],
})
export class IconComponent implements AfterViewInit {
	@Input()
	name: string = '';

	@Input()
	styleClass: string = '';

	@ViewChild('icon') iconSpan: ElementRef;

	constructor() {}

	ngAfterViewInit() {
		this.iconSpan.nativeElement.style.backgroundImage = `url('../../../../assets/images/icons/${this.name}.svg')`;
		this.styleClass
			? (this.iconSpan.nativeElement.className =
					this.iconSpan.nativeElement.className + this.styleClass)
			: null;
	}
}
