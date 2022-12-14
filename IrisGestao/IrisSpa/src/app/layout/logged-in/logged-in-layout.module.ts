import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LoggedInLayoutComponent } from './logged-in-layout.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { FooterComponent } from './footer/footer.component';

@NgModule({
	declarations: [LoggedInLayoutComponent, TopbarComponent, FooterComponent],
	imports: [CommonModule, RouterModule, MenubarModule, AvatarModule],
})
export class LoggedInLayoutModule {}
