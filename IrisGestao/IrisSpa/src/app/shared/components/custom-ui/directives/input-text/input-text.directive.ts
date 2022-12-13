import { Directive, ElementRef } from '@angular/core';

@Directive({
	selector: '[appInputText]',
})
export class InputTextDirective {
	constructor(private el: ElementRef) {
		this.el.nativeElement.classList.add('cstm', 'cstm-input-text');
		// this.el.nativeElement.style.padding = '0.3rem 0.6rem';
		// this.el.nativeElement.style.backgroundColor = '#ffffff';
		// this.el.nativeElement.style.color = 'rgb(30 41 59)';
		// this.el.nativeElement.style.border = 'solid 1px rgb(226 232 240 / 1)';
		// this.el.nativeElement.style.borderRadius = '0.25rem';
	}
}
