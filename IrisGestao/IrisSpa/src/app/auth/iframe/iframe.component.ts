import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit{

  externalLink : string = "https://enterprisetecnologia.b2clogin.com/enterprisetecnologia.onmicrosoft.com/oauth2/v2.0/authorize?p=B2C_1_SignUpSignIn&client_id=6d1f8c53-95af-4cf0-b5b2-479ad282e342&nonce=defaultNonce&redirect_uri=https%3A%2F%2Flocalhost%3A7295&scope=openid&response_type=id_token&prompt=login&ui_locales=pt-BR";

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    
  }

  getLink() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.externalLink);
  }

}
