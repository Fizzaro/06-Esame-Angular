import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarraNavigazioneRoutingModule } from './barra-navigazione-routing.module';
import { BarraNavigazioneComponent } from './barra-navigazione.component';
import { MieiDatiComponent } from './miei-dati/miei-dati.component';
import { IndirizziRecapitiComponent } from './indirizzi-recapiti/indirizzi-recapiti.component';
import { MiaPasswordComponent } from './mia-password/mia-password.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';


@NgModule({
  declarations: [
    MieiDatiComponent,
    IndirizziRecapitiComponent,
    MiaPasswordComponent
  ],
  imports: [
    CommonModule,
    BarraNavigazioneRoutingModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    TypeaheadModule.forRoot()
  ]
})
export class BarraNavigazioneModule { }
