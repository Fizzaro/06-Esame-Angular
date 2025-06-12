import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';
import { UtentiComponent } from './utenti/utenti.component';
import { FilmCatalogoComponent } from './film-catalogo/film-catalogo.component';
import { SerieCatalogoComponent } from './serie-catalogo/serie-catalogo.component';
import { UikitModule } from "../../_condivisi/uikit/uikit.module";
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CategorieVideoComponent } from './categorie-video/categorie-video.component';
import { EpisodiCatalogoComponent } from './episodi-catalogo/episodi-catalogo.component';


@NgModule({
  declarations: [
    AdminComponent,
    UtentiComponent,
    FilmCatalogoComponent,
    SerieCatalogoComponent,
    CategorieVideoComponent,
    EpisodiCatalogoComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    UikitModule,
    ReactiveFormsModule
]
})
export class AdminModule { }
