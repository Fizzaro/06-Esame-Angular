import { inject, NgModule } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './_pagine/not-found/not-found.component';
import { AuthService } from './_servizi/auth.service';

const authGuardAdmin: CanActivateFn = () => {
  const authService = inject(AuthService);
  let result = false
  authService.getSubAuth().subscribe(x => {
    (x.attivo && x.amministratore) ? result = true : null
  }
  )
  return result
}

const authGuardMembro: CanActivateFn = () => {
  const authService = inject(AuthService);
  let result = false
  authService.getSubAuth().subscribe(x => {
    (x.attivo && (x.membro || x.amministratore)) ? result = true : null
  }
  )
  return result
}

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./_pagine/login/login.module').then(m => m.LoginModule) },
  { path: 'home', loadChildren: () => import('./_pagine/home/home.module').then(m => m.HomeModule), canActivate: [authGuardMembro] },
  { path: 'film', loadChildren: () => import('./_pagine/film/film.module').then(m => m.FilmModule), canActivate: [authGuardMembro] },
  { path: 'serie', loadChildren: () => import('./_pagine/serie/serie.module').then(m => m.SerieModule), canActivate: [authGuardMembro] },
  { path: 'admin', loadChildren: () => import('./_pagine/admin/admin.module').then(m => m.AdminModule), canActivate: [authGuardAdmin] },
  { path: 'privato', loadChildren: () => import('./_componentiGenerali/barra-navigazione/barra-navigazione.module').then(m => m.BarraNavigazioneModule), canActivate: [authGuardMembro] },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
