import { Routes } from "@angular/router";
import { AuthenticateComponent } from "./authenticate/authenticate.component";
import { IframeComponent } from "./iframe/iframe.component";
import { LoginComponent } from "./login/login.component";

export const LoginRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'iframe',
        component: IframeComponent
    },
    {
        path: 'authenticate',
        component: AuthenticateComponent
    }
];
