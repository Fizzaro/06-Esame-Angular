import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './_pagine/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./_pagine/login/login.module').then(m => m.LoginModule) },
  { path: 'home', loadChildren: () => import('./_pagine/home/home.module').then(m => m.HomeModule) },
  { path: 'film', loadChildren: () => import('./_pagine/film/film.module').then(m => m.FilmModule) },
  { path: 'serie', loadChildren: () => import('./_pagine/serie/serie.module').then(m => m.SerieModule) },
  { path: 'admin', loadChildren: () => import('./_pagine/admin/admin.module').then(m => m.AdminModule) },
  { path: 'privato', loadChildren: () => import('./_componentiGenerali/barra-navigazione/barra-navigazione.module').then(m => m.BarraNavigazioneModule) },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
