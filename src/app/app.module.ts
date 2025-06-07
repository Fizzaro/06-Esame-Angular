import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './_componentiGenerali/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { PiePaginaComponent } from './_componentiGenerali/pie-pagina/pie-pagina.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { AuthIntercept } from './_interceptor/auth.interceptor';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { DettaglioComponent } from './_condivisi/dettaglio/dettaglio.component';
import { NotFoundComponent } from './_pagine/not-found/not-found.component';
import { PulsanteDirective } from './_direttive/pulsante.directive';
import { BarraNavigazioneComponent } from './_componentiGenerali/barra-navigazione/barra-navigazione.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    PiePaginaComponent,
    DettaglioComponent,
    NotFoundComponent,
    PulsanteDirective,
    BarraNavigazioneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CarouselModule.forRoot(),
    TypeaheadModule.forRoot()
  ],
  exports: [
  ],
  providers:[
    { provide: HTTP_INTERCEPTORS, useClass: AuthIntercept, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
