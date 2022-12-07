import { PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/shared/services';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit{
  
  accessToken: string | null = '';

  constructor(
    private pLocation: PlatformLocation,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    
    this.accessToken = new URLSearchParams(this.pLocation.hash).get('#id_token');
    
  }

  // getParameterByName(name: any) {
  //   let url = window.location.href;
  //   name = name.replace(/[[]]/g, "\$&");
  //   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
  //   results = regex.exec(url);
  //   if (!results) return null;
  //   if (!results[2]) return '';
  //   return decodeURIComponent(results[2].replace(/+/g, " "));
  // }

}
