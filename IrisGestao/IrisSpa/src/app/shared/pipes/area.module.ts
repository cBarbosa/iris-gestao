import { NgModule } from '@angular/core';
import { NgxMaskModule } from 'ngx-mask';
import { AreaPipe } from './area.pipe';

@NgModule({
	imports: [NgxMaskModule.forChild()],
	declarations: [AreaPipe],
	exports: [AreaPipe],
})
export class AreaPipeModule {}
