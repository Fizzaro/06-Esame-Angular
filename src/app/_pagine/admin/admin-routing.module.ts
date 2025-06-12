import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtentiComponent } from './utenti/utenti.component';
import { FilmCatalogoComponent } from './film-catalogo/film-catalogo.component';
import { SerieCatalogoComponent } from './serie-catalogo/serie-catalogo.component';
import { CategorieVideoComponent } from './categorie-video/categorie-video.component';
import { EpisodiCatalogoComponent } from './episodi-catalogo/episodi-catalogo.component';

const routes: Routes = [
  { path: '', redirectTo: 'utenti', pathMatch: 'full' },
  { path: 'utenti', component: UtentiComponent },
  { path: 'film', component: FilmCatalogoComponent },
  { path: 'serie', component: SerieCatalogoComponent },
  { path: 'categorie', component: CategorieVideoComponent },
  { path: 'episodi', component: EpisodiCatalogoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
