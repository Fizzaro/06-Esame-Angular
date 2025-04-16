import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { sha512 } from 'js-sha512';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, catchError, delay, Observable, Observer, of, Subject, take, takeUntil, tap } from 'rxjs';
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
  auth$: BehaviorSubject<Auth>
  private distruggi$ = new Subject<void>

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService,
    private router: Router) {

    this.auth$ = this.authService.getSubAuth()

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

  username: string = ''
  shaUser: string = ''
  password: string = ''
  shaPssw: string = ''

  onInput(event: Event) {
    console.log(sha512((<HTMLInputElement>event.target).value))
  }
  ngOnInit() {

    //Form di login
    this.reactiveLogin = this.fb.group({
      'user': new FormControl('', [Validators.required, Validators.maxLength(40)]),
      'password': new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)])
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
            idUtente: payload.data.idUtente,
            stato: payload.data.stato,
            permesso: payload.data.permesso,
            azioni: payload.data.azioni,
            nomeCompleto: payload.data.nomeCompleto
          }
          this.authService.setSubAuth(auth)
          this.authService.salvaAuthLocalStorage(auth)
          console.log(auth)
          this.router.navigateByUrl('home')
        }
      },
      error: (err) => {
        console.error("Errore observer", err)
        const auth = {
          token: null,
          idUtente: null,
          stato: null,
          permesso: null,
          azioni: null,
          nomeCompleto: null
        }
        this.authService.setSubAuth(auth)
      },
      complete: () => console.log("Completato")
    }

  }


}
