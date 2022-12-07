import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Login } from 'src/app/shared/models';
import { LoginService } from 'src/app/shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('formLogin') formLogin! : NgForm
  login: Login = new Login();
  loading: boolean = false;
  message!: string;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    if(this.loginService.usuarioLogado) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.message = params['error'];
      });
  }

  logar() {
    this.loading = true;

    if(this.formLogin.form.valid) {
      
      this.loginService.login(this.login)
        .subscribe((usuario) => {
        if(usuario != null) {
          this.loginService.usuarioLogado = usuario;
          this.loading = false;
          this.router.navigate(['/home']);
        } else {
          this.loading = false;
          this.message = "Usuário/Senha inválidos";
        }
      });

    }
  }

}
