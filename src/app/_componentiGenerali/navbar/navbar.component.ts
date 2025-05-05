import { Component, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, concat, concatMap, delay, filter, forkJoin, map, Observable, of, Subject, switchMap, take, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { IRispostaServer } from 'src/app/interface/interface';
import { Auth } from 'src/app/type/auth.type';
import { Comune } from 'src/app/type/comune.type';
import { Indirizzo } from 'src/app/type/indirizzo.type';
import { Recapito } from 'src/app/type/recapito.type';
import { TipoIndirizzo } from 'src/app/type/tipoIndirizzo.type';
import { TipoRecapito } from 'src/app/type/tipoRecapito';
import { Utente } from 'src/app/type/utente.type';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  loggato: boolean =false
  scopoModal: boolean | null = null
  indirizzoForm!: FormGroup
  recapitoForm!: FormGroup
  auth$!: BehaviorSubject<Auth>
  private distruggi$ = new Subject<void>
  utenteAuth!: Auth
  utente!: Utente
  indirizzi: Indirizzo[] = []
  tipiIndirizzo: TipoIndirizzo[] = []
  recapiti: Recapito[] = []
  tipiRecapito: TipoRecapito[] = []
  cittaNascita: Comune[] = []
  indirizzoTable: 'Nuovo' | 'Modifica' | null = null
  recapitoTable: 'Nuovo' | 'Modifica' | null = null

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private api: ApiService
  ) {

    this.loggato=authService.loggato
    this.auth$ = this.authService.getSubAuth()
    const newAuth$ = this.auth$.asObservable()

    newAuth$.pipe(
      tap(x => console.log('Primo pipe ', x.idUtente)),
      // uso switchMap per eliminare le richieste multiple
      switchMap(auth => {
        const id = auth.idUtente

        return forkJoin({
          indirizzi: this.api.getIndirizzi(id, 'utente'),
          recapiti: this.api.getRecapiti(id, 'utente')
        }).pipe(
          tap(x => console.log('Secondo pipe ', x)),
          map(ris => ({
            auth,
            ...ris
          })
          )
        )
      })
    ).subscribe({
      next: data => {
        console.log('Auth:', data.auth);
        console.log('Indirizzi:', data.indirizzi);
        console.log('Recapiti:', data.recapiti);
      },
      error: err => {
        console.error('Errore nella catena API:', err);
      }
    })


    //console.log('Auth iniziale ',this.auth$.value)
    // this.auth$.pipe(
    //   // map((x)=>{
    //   //   if(x.idUtente!==null){
    //   //     return x.idUtente
    //   //   }else{
    //   //     return 0
    //   //   }
    //   // }),
    //   concatMap((x: Auth): Observable<IRispostaServer> => {

    //     return this.apiUtente(x)


    //   }),
    //   concatMap((x) => {

    //   })

    // ).subscribe(() => {
    //   //this.apiUtente(this.utenteAuth.idUtente)
    //   // this.apiIndirizzi(this.utenteAuth.idUtente)
    //   // this.apiRecapiti(this.utenteAuth.idUtente)

    //   // forkJoin([
    //   //   this.api.getIndirizzi(this.utenteAuth.idUtente, 'utente'),
    //   //   this.api.getRecapiti(this.utenteAuth.idUtente, 'utente'),
    //   //   this.api.getTipologieIndirizzo(),
    //   //   this.api.getTipologieRecapito()
    //   // ]).pipe(
    //   //   delay(700)
    //   // ).subscribe(res => {
    //   //   this.indirizzi = res[0].data
    //   //   this.recapiti = res[1].data
    //   //   this.tipiIndirizzo = res[2].data
    //   //   this.tipiRecapito = res[3].data
    //   //     //this.indiRecap = [res[0].data, res[1].data];
    //   //     console.log ('Tutto', res);
    //   //   });

    // })

    // funzione per eliminare i dati nulli

  }

  apiUtente(id: number) {

    return this.api.getUtente(id).pipe(
      take(1),
      tap(x => console.log("utente", x))
    )
    // .subscribe(x => this.utente = x.data)

  }

  apiIndirizzi(id: number | null) {
    if (id !== null) {
      this.api.getIndirizzi(id, 'utente').pipe(
        take(1),
        tap(x => console.log("indirizzo", x))
      ).subscribe(x => this.indirizzi = x.data)

      this.api.getTipologieIndirizzo().subscribe(x => this.tipiIndirizzo = x.data)
    }
  }

  apiRecapiti(id: number | null) {
    if (id !== null) {
      this.api.getRecapiti(id, 'utente').pipe(
        take(1),
        tap(x => console.log("recapito", x))
      ).subscribe(x => this.recapiti = x.data)

      this.api.getTipologieRecapito().subscribe(x => this.tipiRecapito = x.data)
    }
  }

  leggiCitta() {
    if (this.cittaNascita.length == 0) {
      this.api.getComuni(null).pipe(
        map(x => this.cittaNascita = x.data),
      ).subscribe()
    }
  }

  //Trova e restituisce la tipologia di indirizzo o recapito dal suo id
  generaTipo(id: number | null, tipo: string) {
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

  //Visualizza e assegna i valori al form degli indirizzi
  apriIndirizzo(indirizzo: Indirizzo | null) {
    if (indirizzo == null) {
      this.indirizzoTable = 'Nuovo'
      this.indirizzoForm.controls['tipoIndirizzo'].setValue('')
      this.indirizzoForm.controls['comuneIndirizzo'].setValue('')
      this.indirizzoForm.controls['indirizzo'].setValue('')
    } else {
      let comune
      this.cittaNascita.forEach(x => {
        if (x.idComune == indirizzo.idComune) {
          comune = x.comune
        }
      })
      this.indirizzoTable = 'Modifica'
      this.indirizzoForm.controls['tipoIndirizzo'].setValue(indirizzo.idTipologiaIndirizzo)
      this.indirizzoForm.controls['comuneIndirizzo'].setValue(comune)
      this.indirizzoForm.controls['indirizzo'].setValue(indirizzo.indirizzo)
    }
  }

  //Visualizza e assegna i valori al form dei recapiti
  apriRecapito(recapito: Recapito | null) {
    if (recapito == null) {
      this.recapitoTable = 'Nuovo'
      this.recapitoForm.controls['tipoRecapito'].setValue('')
      this.recapitoForm.controls['recapito'].setValue('')
    } else {
      this.recapitoTable = 'Modifica'
      this.recapitoForm.controls['tipoRecapito'].setValue(recapito.idTipologiaRecapito)
      this.recapitoForm.controls['recapito'].setValue(recapito.recapito)
    }
  }

  formIndirizzo() {

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

  onFocus(event: FocusEvent) {
    // if (this.reactiveForm.controls['nome'].value &&
    //   this.reactiveForm.controls['cognome'].value &&
    //   this.reactiveForm.controls['sesso'].value &&
    //   this.reactiveForm.controls['data'].value &&
    //   this.reactiveForm.controls['nascita'].value) {
    //   this.reactiveForm.controls['codFisc'].setValue(UtilityService.generaCodFisc(this.reactiveForm.controls['nome'].value,
    //     this.reactiveForm.controls['cognome'].value,
    //     this.reactiveForm.controls['sesso'].value,
    //     this.reactiveForm.controls['data'].value,
    //     this.reactiveForm.controls['nascita'].value
    //   ))
    // }

  }

  modalMieiDati() {
    this.showModal()
    this.scopoModal = null
  }
  modalIndirizziRecapiti() {
    this.showModal()
    this.leggiCitta()
    this.scopoModal = true
  }

  ngOnChanges(changes: any) {
    if (this.auth$.value.idUtente !== null) {

    }
  }

  ngOnInit() {




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

    //Form delle credenziali
    // this.reactiveForm = this.fb.group({
    //   username: new FormControl('', [Validators.required, Validators.maxLength(40)]),
    //   password1: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]),
    //   passwordRepeat: new FormControl('', [Validators.required])
    // }, {
    //   validator: [this.controllaPassword('password1'), this.MatchPassword('password1', 'passwordRepeat')]
    // })

  }

  ngOnDestroy() {
    this.distruggi$.next()
  }

  //Proprietà e metodo per controllare la robustezza della password
  alertPassword: string = ''
  barWidth: string = '0'
  barColor: string = ''

  controllaPassword(password: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password]
      const passwordValue = passwordControl.value
      let x: number = 0
      let ok: boolean = false

      //controllo numeri
      if (/[0-9]/.test(passwordValue)) { x += 20 }
      //controllo minuscole
      if (/[a-z]/.test(passwordValue)) { x += 20 }
      //controllo maiuscole
      if (/[A-Z]/.test(passwordValue)) { x += 20 }
      //controllo simboli
      if (/[$-/:-?{-~!"^_`\[\]]/.test(passwordValue)) { x += 20 }
      // controllo lunghezza (minore o uguale a 8 caratteri)
      if (passwordValue.length >= 8) { x += 20 }

      // risultato
      this.barWidth = x + "%"
      // percentuale di robustezza
      if (x == 100) {
        this.barColor = "green"
        this.alertPassword = "Ottima"
        ok = true
      } else if (x == 80) {
        this.barColor = "green"
        this.alertPassword = "Buona"
      } else if (x == 60) {
        this.barColor = "yellow"
        this.alertPassword = "Mediocre"
      } else {
        this.barColor = "red"
        this.alertPassword = "Pessima"
      }

      if (passwordValue.length == 0) {
        x == 0
        this.alertPassword = ""
      }

      //controllo spazi bianchi
      if (/\s\S/.test(passwordValue)) {
        this.alertPassword = "La password non può contenere spazi bianchi"
        this.barColor = "red"
        ok = false
      }

      //setto l'errore in base al risultato
      if (!ok) {
        passwordControl.setErrors({ passwordSecurity: true })
      } else {
        passwordControl.setErrors(null)
      }
    }
  }

  //Metodo per confrontare le due password
  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password]
      const confirmPasswordControl = formGroup.controls[confirmPassword]

      if (passwordControl.value && confirmPasswordControl.value) {
        if (passwordControl.value !== confirmPasswordControl.value) {
          confirmPasswordControl.setErrors({ passwordMismatch: true })
        } else {
          confirmPasswordControl.setErrors(null)
        }
      }
    }
  }

  inviaForm() {
  }
}
