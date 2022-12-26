import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './shared/helpers/auth/auth.interceptor';
import { ErrorInterceptor } from './shared/helpers/auth/error.interceptor';
import { registerLocaleData } from '@angular/common';
import { CpfCnpjPipeModule } from './shared/pipes';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { CurrencyMaskInputMode, NgxCurrencyModule } from 'ngx-currency';

import localePT from '@angular/common/locales/pt';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(localePT);
registerLocaleData(ptBr);

export const options: Partial<null | IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		RouterModule,
		AuthModule,
		CpfCnpjPipeModule,
		NgxMaskModule.forRoot({
			dropSpecialCharacters: true,
			thousandSeparator: '.',
		}),
		NgxCurrencyModule.forRoot({
			align: 'left',
			allowNegative: false,
			allowZero: true,
			decimal: ',',
			precision: 2,
			prefix: 'R$ ',
			suffix: '',
			thousands: '.',
			nullable: true,
			inputMode: CurrencyMaskInputMode.FINANCIAL,
		}),
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		{ provide: LOCALE_ID, useValue: 'pt-br' },
		{ provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
