import { inject, NgModule } from '@angular/core';
import { CanActivateFn, RouterModule, Routes } from '@angular/router';
import { UtentiComponent } from './utenti/utenti.component';
import { FilmCatalogoComponent } from './film-catalogo/film-catalogo.component';
import { SerieCatalogoComponent } from './serie-catalogo/serie-catalogo.component';
import { AuthService } from 'src/app/_servizi/auth.service';

const authGuardFn: CanActivateFn = () => {
  const authService = inject(AuthService);
  let result = false
  authService.getSubAuth().subscribe(x => {
    (x.attivo && x.amministratore) ? result= true : null }
  )
  return result
}

const routes: Routes = [
  { path: '', redirectTo: 'utenti', pathMatch: 'full' },
  { path: 'utenti', component: UtentiComponent, canActivate:[authGuardFn] },
  { path: 'film', component: FilmCatalogoComponent, canActivate:[authGuardFn] },
  { path: 'serie', component: SerieCatalogoComponent, canActivate:[authGuardFn] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
