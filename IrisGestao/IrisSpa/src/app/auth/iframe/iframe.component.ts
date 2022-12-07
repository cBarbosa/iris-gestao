import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment as env  } from '../../../environments/environment';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit{

  externalLink : string = env.config.b2cAuthUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    
  }

  getLink() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.externalLink);
  }

}
