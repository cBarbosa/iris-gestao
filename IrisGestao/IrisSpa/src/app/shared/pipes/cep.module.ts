import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { CepPipe } from './cep.pipe';

@NgModule({
	imports: [NgxMaskModule.forChild()],
	declarations: [CepPipe],
	exports: [CepPipe],
})
export class CepPipeModule {}
