import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, forkJoin, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/type/auth.type';
import { Comune } from 'src/app/type/comune.type';
import { Indirizzo } from 'src/app/type/indirizzo.type';
import { Recapito } from 'src/app/type/recapito.type';
import { TipoIndirizzo } from 'src/app/type/tipoIndirizzo.type';
import { TipoRecapito } from 'src/app/type/tipoRecapito';
import { Utente } from 'src/app/type/utente.type';

@Component({
  selector: 'indirizzi-recapiti',
  templateUrl: './indirizzi-recapiti.component.html',
  styleUrls: ['./indirizzi-recapiti.component.scss']
})
export class IndirizziRecapitiComponent {

  indirizzoForm!: FormGroup
  recapitoForm!: FormGroup

  auth$!: BehaviorSubject<Auth>
  utenteAuth!: Auth
  utente!: Utente
  private distruggi$ = new Subject<void>

  indirizzi: Indirizzo[] = []
  tipiIndirizzo: TipoIndirizzo[] = []
  recapiti: Recapito[] = []
  tipiRecapito: TipoRecapito[] = []
  cittaNascita: Comune[] = []

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {

  }

  //Auto Modal
  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  isModalShown = false;

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal?.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  //Trova e restituisce la tipologia di indirizzo o recapito dal suo id
  generaTipo(id: number | null, tipo: 'indirizzo' | 'recapito') {
    let result = null
    if (tipo == 'indirizzo') {
      this.tipiIndirizzo.forEach(x => {
        if (x.idTipologiaIndirizzo == id) {
          result = x.tipo
        }
      })
    } else if (tipo == 'recapito') {
      this.tipiRecapito.forEach(x => {
        if (x.idTipologiaRecapito == id) {
          result = x.tipo
        }
      })
    }
    return result

  }

  //Trova e restituisce il corrispettivo comune dal suo id 
  generaComune(id: number | null) {
    let result = null
    this.cittaNascita.forEach(x => {
      if (x.idComune == id) {
        result = x.comune
      }
    })
    return result
  }

  //Trova e restituisce il corrispettivo id dal suo comune 
  generaIdComune(comune: string | null) {
    let result = null
    this.cittaNascita.forEach(x => {
      if (x.comune == comune) {
        result = x.idComune
      }
    })
    return result
  }

  indirizzoTable: 'Nuovo' | 'Modifica' | 'Elimina' | null = null
  recapitoTable: 'Nuovo' | 'Modifica' | 'Elimina' | null = null
  //proprietà per salvare l'id dell'indirizzo da modificare o eliminare
  conservoIdIndirizzo: number | null = null

  //Visualizza e assegna i valori al form degli indirizzi da modificare
  apriIndirizzo(indirizzo: Indirizzo | null) {
    if (indirizzo == null) {
      (this.indirizzoTable == 'Nuovo') ? this.indirizzoTable=null : this.indirizzoTable = 'Nuovo'
      this.indirizzoForm.controls['tipoIndirizzo'].setValue('')
      this.indirizzoForm.controls['comuneIndirizzo'].setValue('')
      this.indirizzoForm.controls['indirizzo'].setValue('')
    } else {
      let comune
      this.cittaNascita.forEach(x => {
        if (x.idComune == indirizzo.idComune) {
          comune = x.comune
        }
      });
      (this.indirizzoTable == 'Modifica') ? this.indirizzoTable=null : this.indirizzoTable = 'Modifica'
      this.indirizzoForm.controls['tipoIndirizzo'].setValue(indirizzo.idTipologiaIndirizzo)
      this.indirizzoForm.controls['comuneIndirizzo'].setValue(comune)
      this.indirizzoForm.controls['indirizzo'].setValue(indirizzo.indirizzo)
      this.conservoIdIndirizzo=indirizzo.idIndirizzo
    }
  }

  //Visualizza e assegna i valori al form degli indirizzi da eliminare
  eliminaIndirizzo(indirizzo: Indirizzo) {
    let comune
    this.cittaNascita.forEach(x => {
      if (x.idComune == indirizzo.idComune) {
        comune = x.comune
      }
    })
    this.indirizzoTable = 'Elimina'
    this.indirizzoForm.controls['tipoIndirizzo'].setValue(indirizzo.idTipologiaIndirizzo)
    this.indirizzoForm.controls['comuneIndirizzo'].setValue(comune)
    this.indirizzoForm.controls['indirizzo'].setValue(indirizzo.indirizzo)
  }

  //Proprietà per salvare l'id del recapito da modificare o eliminare
  conservoIdRecapito: number | null = null

  //Visualizza e assegna i valori al form dei recapiti
  apriRecapito(recapito: Recapito | null) {
    if (recapito == null) {
      (this.recapitoTable == 'Nuovo') ? this.recapitoTable=null : this.recapitoTable = 'Nuovo'
      this.recapitoForm.controls['tipoRecapito'].setValue('')
      this.recapitoForm.controls['recapito'].setValue('')
    } else {
      (this.recapitoTable == 'Modifica') ? this.recapitoTable=null : this.recapitoTable = 'Modifica'
      this.recapitoForm.controls['tipoRecapito'].setValue(recapito.idTipologiaRecapito)
      this.recapitoForm.controls['recapito'].setValue(recapito.recapito)
      this.conservoIdRecapito = recapito.idRecapito
    }
  }

  //Visualizza e assegna i valori al form dei recapiti da eliminare
  eliminaRecapito(recapito: Recapito) {
    this.recapitoTable = 'Elimina'
    this.recapitoForm.controls['tipoRecapito'].setValue(recapito.idTipologiaRecapito)
    this.recapitoForm.controls['recapito'].setValue(recapito.recapito)
    this.conservoIdRecapito = recapito.idRecapito
  }

  //Crea un nuovo indirizzo o lo modifica o lo elimina
  formIndirizzo() {
    const form = this.indirizzoForm.controls
    if (this.indirizzoTable == "Modifica") {
      const modificato: Partial<Indirizzo> = {
        idTipologiaIndirizzo: form['tipoIndirizzo'].value,
        idComune: this.generaIdComune(form['comuneIndirizzo'].value),
        indirizzo: form['indirizzo'].value,
      }
      if (this.conservoIdIndirizzo !== null) {
        this.api.putIndirizzi(this.conservoIdIndirizzo, modificato).subscribe(() => window.location.reload())
      }
    } else if (this.indirizzoTable == "Nuovo") {
      const nuovo: Partial<Indirizzo> = {
        idUtente: this.utente.idUtente,
        idTipologiaIndirizzo: form['tipoIndirizzo'].value,
        idComune: this.generaIdComune(form['comuneIndirizzo'].value),
        indirizzo: form['indirizzo'].value,
        lat: 'a',
        long: 'b'
      }
      this.api.postIndirizzi(nuovo).subscribe(() => window.location.reload())
    } else if (this.indirizzoTable == "Elimina") {
      if (this.conservoIdIndirizzo !== null) {
        this.api.deleteIndirizzi(this.conservoIdIndirizzo).subscribe(() => window.location.reload())
      }
    }
  }

  //Crea un nuovo recapito o lo modifica o lo elimina
  formRecapito() {
    const form = this.recapitoForm.controls
    if (this.recapitoTable == "Modifica") {
      const modificato: Partial<Recapito> = {
        idTipologiaRecapito: form['tipoRecapito'].value,
        recapito: form['recapito'].value,
      }
      if (this.conservoIdRecapito !== null) {
        this.api.putRecapiti(this.conservoIdRecapito, modificato).subscribe(() => window.location.reload())
      }
    } else if (this.recapitoTable == "Nuovo") {
      const nuovo: Partial<Recapito> = {
        idUtente: this.utente.idUtente,
        idTipologiaRecapito: form['tipoRecapito'].value,
        recapito: form['recapito'].value,
      }
      this.api.postRecapiti(nuovo).subscribe(() => window.location.reload())
    } else if (this.recapitoTable == "Elimina") {
      if (this.conservoIdRecapito !== null) {
        this.api.deleteRecapiti(this.conservoIdRecapito).subscribe(() => window.location.reload())
      }
    }
  }

  logout() {
    this.authService.eliminaAuth()
    this.router.navigateByUrl('login/access')
  }

  
  ngOnInit() {

    this.auth$ = this.authService.getSubAuth()
    this.auth$.pipe(
      // uso switchMap per eliminare le richieste multiple
      switchMap(auth => {
        const id = auth.idUtente
        const scad = auth.scadenza
        if (id !== null && scad !== null && scad > (Date.now() / 1000)) {
          return forkJoin({
            utente: this.api.getUtente(id),
            indirizzi: this.api.getIndirizzi(id, 'utente'),
            recapiti: this.api.getRecapiti(id, 'utente'),
            tipoIndirizzo: this.api.getTipologieIndirizzo(),
            tipoRecapito: this.api.getTipologieRecapito(),
            comuni: this.api.getComuni(null)
          }).pipe(
            map(ris => ({
              auth,
              ...ris
            }))
          );
        } else {
          (scad !== null && scad < (Date.now() / 1000)) ? this.logout() : null
          // restituisce lo stesso oggetto ma con tutti i dati nulli
          return of({
            auth,
            utente: { data: null },
            indirizzi: { data: null },
            recapiti: { data: null },
            tipoIndirizzo: { data: null },
            tipoRecapito: { data: null },
            comuni: { data: null }
          });
        }
      }),
      takeUntil(this.distruggi$)
    ).subscribe({
      next: data => {
        this.utenteAuth = data.auth
        this.utente = data.utente.data
        this.indirizzi = data.indirizzi.data
        this.recapiti = data.recapiti.data
        this.tipiIndirizzo = data.tipoIndirizzo.data
        this.tipiRecapito = data.tipoRecapito.data
        this.cittaNascita = data.comuni.data
      },
      error: err => {
        console.error('Errore nella catena API:', err);
      }
    })


    //Form degli indirizzi
    this.indirizzoForm = this.fb.group({
      tipoIndirizzo: new FormControl('', [Validators.required]),
      comuneIndirizzo: new FormControl('', [Validators.required]),
      indirizzo: new FormControl('', [Validators.required, Validators.maxLength(40)])
    })

    //Form dei recapiti
    this.recapitoForm = this.fb.group({
      tipoRecapito: new FormControl('', [Validators.required]),
      recapito: new FormControl('', [Validators.required, Validators.maxLength(40)])
    })
  }

  ngOnDestroy() {
    this.distruggi$.next()
  }
}
