import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmRoutingModule } from './film-routing.module';
import { FilmComponent } from './film.component';
import { UikitModule } from "../../_condivisi/uikit/uikit.module";
import { CarouselModule } from 'ngx-bootstrap/carousel';


@NgModule({
  declarations: [
    FilmComponent
  ],
  imports: [
    CommonModule,
    FilmRoutingModule,
    CarouselModule.forRoot(),
    UikitModule
]
})
export class FilmModule { }
