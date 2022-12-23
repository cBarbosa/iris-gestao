import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { IframeComponent } from './iframe/iframe.component';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { HttpClientModule } from '@angular/common/http';
import { SpinnerComponent } from '../shared/components/custom-ui/spinner/spinner.component';

@NgModule({
	declarations: [LoginComponent, IframeComponent, AuthenticateComponent],
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		HttpClientModule,
		SpinnerComponent,
	],
})
export class AuthModule {}
