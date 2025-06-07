import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MieiDatiComponent } from './miei-dati/miei-dati.component';
import { IndirizziRecapitiComponent } from './indirizzi-recapiti/indirizzi-recapiti.component';
import { MiaPasswordComponent } from './mia-password/mia-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'miei-dati', pathMatch: 'full' },
  { path: 'miei-dati', component: MieiDatiComponent },
  { path: 'indirizzi-recapiti', component: IndirizziRecapitiComponent },
  { path: 'mia-password', component: MiaPasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BarraNavigazioneRoutingModule { }
