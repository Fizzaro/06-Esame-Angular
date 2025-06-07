import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SerieRoutingModule } from './serie-routing.module';
import { SerieComponent } from './serie.component';
import { UikitModule } from "../../_condivisi/uikit/uikit.module";
import { CarouselModule } from 'ngx-bootstrap/carousel';


@NgModule({
  declarations: [
    SerieComponent
  ],
  imports: [
    CommonModule,
    SerieRoutingModule,
    CarouselModule.forRoot(),
    UikitModule
]
})
export class SerieModule { }
