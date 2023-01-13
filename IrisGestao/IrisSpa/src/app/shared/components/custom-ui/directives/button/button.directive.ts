import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[appButton]',
})
export class ButtonDirective {
	constructor(private el: ElementRef) {
		// this.el.nativeElement.classList.add('cstm', 'cstm-button');
		this.el.nativeElement.className =
			'cstm cstm-button ' + this.el.nativeElement.className;
	}
}
