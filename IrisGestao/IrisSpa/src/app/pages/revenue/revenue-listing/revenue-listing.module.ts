import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevenueListingRoutingModule } from './revenue-listing-routing.module';
import { RevenueListingComponent } from './revenue-listing.component';


@NgModule({
  declarations: [
    RevenueListingComponent
  ],
  imports: [
    CommonModule,
    RevenueListingRoutingModule
  ]
})
export class RevenueListingModule { }
