import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoggedInLayoutComponent } from './logged-in-layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { FooterComponent } from './footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';

import { PanelMenuModule } from 'primeng/panelmenu';

@NgModule({
	declarations: [LoggedInLayoutComponent, TopbarComponent, FooterComponent],
	imports: [
		CommonModule,
		RouterModule,
		MenubarModule,
		AvatarModule,
		ButtonModule,
		SidebarModule,
		PanelMenuModule,
	],
})
export class LoggedInLayoutModule {}
