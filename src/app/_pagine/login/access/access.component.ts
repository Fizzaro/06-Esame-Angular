import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, Observable, Observer, of, Subject, take, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { IRispostaServer } from 'src/app/interface/interface';
import { Auth } from 'src/app/type/auth.type';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent {

  reactiveLogin!: FormGroup
  auth$!: BehaviorSubject<Auth>
  erroreLogin: string = ''
  private distruggi$ = new Subject<void>
  spinner: boolean = false

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private router: Router) {

  }

  //Auto Modal
  @ViewChild('autoShownModal', { static: false }) autoShownModal?: ModalDirective;
  isModalShown = true;

  showModal(): void {
    this.isModalShown = true;
  }

  hideModal(): void {
    this.autoShownModal?.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
  }

  ngOnInit() {

    this.auth$ = this.authService.getSubAuth()
    this.auth$.pipe(
      takeUntil(this.distruggi$)
    ).subscribe({
      next: auth => {
        if (auth.scadenza !== null && auth.scadenza < (Date.now() / 1000)) {
          location.reload()
        }
      }
    })

    //Form di login
    this.reactiveLogin = this.fb.group({
      'user': new FormControl('', [Validators.required, Validators.maxLength(40)]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]),
      'collegato': new FormControl('')
    })

  }

  ngOnDestroy() {
    this.distruggi$.next()
  }

  //Metodi per effettuare il Login
  onLogin() {
    this.leggiObs(
      this.reactiveLogin.controls['user'].value,
      this.reactiveLogin.controls['password'].value)
      .subscribe(this.osservoObs())
  }

  private leggiObs(username: string, password: string): Observable<IRispostaServer> {
    this.spinner = true
    return this.api.login(username, password).pipe(
      take(1),
      //creo e ritorno un observable in caso di errore
      catchError((err: Error) => {
        const errObs: IRispostaServer = {
          data: null,
          error: err,
          message: "Errore leggiObs"
        }
        return of(errObs)
      }),
      takeUntil(this.distruggi$)
    )
  }

  private osservoObs(): Observer<IRispostaServer> {
    return {
      next: (rit: IRispostaServer) => {
        if (rit.data !== null) {
          const tk: string = rit.data.token
          const payload = UtilityService.decifraToken(tk)
          const auth: Auth = {
            token: tk,
            scadenza: payload.exp,
            idUtente: payload.data.idUtente,
            attivo: (payload.data.stato == 'attivo') ? true : false,
            amministratore: (payload.data.permesso == 'Amministratore') ? true : false,
            membro: (payload.data.permesso == 'Membro') ? true : false,
            nomeCompleto: payload.data.nomeCompleto
          }
          //console.log(new Date(payload.exp*1000))
          if (this.reactiveLogin.controls['collegato'].value) {
            this.authService.salvaAuthLocalStorage(auth)
          } else this.authService.salvaAuthSessionStorage(auth)
          this.authService.setSubAuth(auth)
          this.spinner = false
          this.router.navigateByUrl('home')
        } else {
          this.spinner = false
          this.erroreLogin = 'ATTENZIONE: ' + rit.message
        }
      },
      error: (err) => {
        console.error("Errore observer", err)
        const auth = {
          token: null,
          scadenza: null,
          idUtente: null,
          attivo: null,
          amministratore: null,
          membro: null,
          nomeCompleto: null
        }
        this.authService.setSubAuth(auth)
      },
      complete: () => null
    }

  }


}
