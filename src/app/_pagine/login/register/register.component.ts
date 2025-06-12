import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { UtilityService } from 'src/app/_servizi/utility.service';
import { Auth } from 'src/app/type/auth.type';
import { Comune } from 'src/app/type/comune.type';
import { Registra } from 'src/app/type/registra.type';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registrato: boolean = false
  reactiveForm!: FormGroup
  auth$: BehaviorSubject<Auth>
  private distruggi$ = new Subject<void>
  cittaNascita: Comune[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private api: ApiService) {

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

  onFocus(event: FocusEvent) {
    if (this.reactiveForm.controls['nome'].value &&
      this.reactiveForm.controls['cognome'].value &&
      this.reactiveForm.controls['sesso'].value &&
      this.reactiveForm.controls['data'].value &&
      this.reactiveForm.controls['nascita'].value) {
      this.reactiveForm.controls['codFisc'].setValue(UtilityService.generaCodFisc(this.reactiveForm.controls['nome'].value,
        this.reactiveForm.controls['cognome'].value,
        this.reactiveForm.controls['sesso'].value,
        this.reactiveForm.controls['data'].value,
        this.reactiveForm.controls['nascita'].value
      ))
    }

  }

  leggiCitta() {
    const citta=this.reactiveForm.controls['nascita'].value;
    if (citta.length>2) {
      this.api.getComuni(citta).pipe(
        map(x => this.cittaNascita = x.data),
      ).subscribe()
    }
  }

  ngOnInit() {

    //Form di registrazione
    this.reactiveForm = this.fb.group({
      nome: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      cognome: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      sesso: new FormControl('', [Validators.required]),
      nascita: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      data: new FormControl('', [Validators.required]),
      codFisc: new FormControl('', [Validators.required, this.controllaCF()]),
      email: new FormControl('', [Validators.required, Validators.email]),
      username: new FormControl('', [Validators.required, Validators.maxLength(40)]),
      password1: new FormControl('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/)]),
      passwordRepeat: new FormControl('', [Validators.required])
    }, {
      validator: [this.controllaPassword('password1'), this.MatchPassword('password1', 'passwordRepeat')]
    })

  }

  ngOnDestroy() {
    this.distruggi$.next()
  }

  //Proprietà e metodi per controllare la validità del codice fiscale
  messCodFisc: string = ''

  controllaCF(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const codFiscControl = control
      const codFiscValue = (codFiscControl.value).replace(/\s/g, " ");
      let s: number = 0
      let ok: boolean = false

      if (codFiscValue != '') {
        // const codFiscValue = codValue.replace(/\s/g, " ");
        // console.log(codValue, ' - ', codFiscValue)
        this.messCodFisc = ''
        let cf: string = codFiscValue.toUpperCase()

        if (cf.length > 16) {
          this.messCodFisc = "Il codice fiscale dovrebbe essere lungo 16 caratteri."
        } else if (cf.length == 16) {
          this.messCodFisc = ''

          const set1: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          const set2: string = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ"
          const setpari: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          const setdisp: string = "BAKPLCQDREVOSFTGUHMINJWZYX"

          for (let i = 1; i <= 13; i += 2)
            s += setpari.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))))

          for (let i = 0; i <= 14; i += 2)
            s += setdisp.indexOf(set2.charAt(set1.indexOf(cf.charAt(i))))

          if (s % 26 != cf.charCodeAt(15) - 'A'.charCodeAt(0)) {
            this.messCodFisc = "Il codice fiscale non è corretto!"
          } else ok = true
        }
      }

      //ritorno l'errore o null in base al risultato
      if (!ok) {
        return { codFiscControl: true }
      } else {
        this.messCodFisc = ''
        return null
      }
    }
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
    const form = this.reactiveForm.controls

    let sesso=form['sesso'].value
    if (sesso=='maschio') {sesso=0} else if (sesso=='femmina') {sesso=1}
    const newUtente: Registra = {
      nome: form['nome'].value,
      cognome: form['cognome'].value,
      sesso: sesso,
      dataNascita: form['data'].value,
      comuneNascita: form['nascita'].value,
      codFiscale: form['codFisc'].value,
      recapito: form['email'].value,
      username: form['username'].value,
      password: form['password1'].value
    }

    this.api.postRegistraUtente(newUtente).subscribe(()=>this.registrato=true)

  }
}
