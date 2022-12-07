import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRoutes } from './auth/auth-routing.module';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/helpers/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'ADMIN,GERENTE,FUNC,DEV'
    }
  },
  ...LoginRoutes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
