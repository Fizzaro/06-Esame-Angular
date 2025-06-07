import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/type/auth.type';

@Component({
  selector: 'mia-password',
  templateUrl: './mia-password.component.html',
  styleUrls: ['./mia-password.component.scss']
})
export class MiaPasswordComponent {

  auth$!: BehaviorSubject<Auth>
  private distruggi$ = new Subject<void>
  utenteAuth!: Auth
  idUtente!: number | null
  credenzialiForm!: FormGroup

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router
  ) {

  }

  //Modifica la password
  formCredenziali() {
    const form = this.credenzialiForm.controls
    if (this.idUtente) {
      this.api.modificaPassword(this.idUtente, form['passwordVecchia'].value, form['password1'].value).subscribe(x => this.alertPassword = x.message)
    }
    setInterval(() => window.location.reload(), 1500)
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

  logout() {
    this.authService.eliminaAuth()
    this.router.navigateByUrl('login/access')
  }

  ngOnInit() {

    this.auth$ = this.authService.getSubAuth()
    this.auth$.pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      auth => {
        this.idUtente = auth.idUtente
        const scad = auth.scadenza
        if (scad !== null && scad < (Date.now() / 1000)) {
          this.logout()
        }
      }
    )


    //Form delle credenziali
    this.credenzialiForm = this.fb.group({
      passwordVecchia: new FormControl('', [Validators.required]),
      password1: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]),
      passwordRepeat: new FormControl('', [Validators.required])
    }, {
      validator: [this.controllaPassword('password1'), this.MatchPassword('password1', 'passwordRepeat')]
    })
  }

  //Proprietà e metodo per controllare la robustezza della password
  alertPassword: string | null = ''
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

  ngOnDestroy() {
    this.distruggi$.next()
  }

}
