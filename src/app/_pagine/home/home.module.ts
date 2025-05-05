import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { UikitModule } from 'src/app/_condivisi/uikit/uikit.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    CarouselModule.forRoot(),
    UikitModule
]
})
export class HomeModule { }
