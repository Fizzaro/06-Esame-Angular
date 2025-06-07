import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/_servizi/api.service';
import { Recapito } from 'src/app/type/recapito.type';
import { Utente } from 'src/app/type/utente.type';

@Component({
  selector: 'utenti',
  templateUrl: './utenti.component.html',
  styleUrls: ['./utenti.component.scss']
})
export class UtentiComponent {

  scheda: string = 'utenti'
  active: string | null = 'active'
  users: Utente[] = []
  usersPermessi: Utente[] = []
  usersStati: Utente[] = []
  email: Recapito[] = []

  control!: FormGroup

  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) {

  }

  //Ritorna il tipo Recapito mail dell'idUtente passato
  recFilter(id: number | null): Recapito | null {
    let mail = this.email.find(x => x.idUtente == id)
    if (mail !== undefined) {
      return mail
    } else return null
  }

  // schedaUtenti() {
  //   this.scheda = 'utenti'
  // }
  schedaPermessi() {
    this.scheda = 'permessi'
    this.active = null
  }
  schedaStati() {
    this.scheda = 'stati'
    this.active = null
  }

  apiUtenti() {
    const codice = this.control.controls['ricerca'].value
    this.api.getUtente(null, null).subscribe(
      x => {
        this.users = x.data
        if (codice) {
          this.users = this.users.filter(x => x.codFiscale == codice)
        }
      })

  }
  apiPermessi(permesso: number) {
    this.api.getUtente(permesso, "permesso").subscribe(
      x => this.usersPermessi = x.data)
  }
  apiStati(stato: number) {
    this.api.getUtente(stato, "stato").subscribe(
      x => this.usersStati = x.data)
  }

  eliminaUtente(id: number | null) {
    if (id !== null) {
      this.api.deleteUtenti(id).subscribe({
        next: () => location.reload()
      })
    }
  }
  cambiaStato(user: Utente | null, tipo: number, stato: 'disattiva' | 'attiva' | 'sospendi') {
    if (user !== null && user.idUtente !== null && user.idStato !== tipo) {
      this.api.cambiaStato(user.idUtente, stato).subscribe({
        next: () => location.reload()
      })
    }
  }
  cambiaPermesso(user: Utente | null, tipo: number, permesso: "amministratore" | "membro" | "ospite") {
    if (user !== null && user.idUtente !== null && user.idPermesso !== tipo) {
      this.api.cambiaPermesso(user.idUtente, permesso).subscribe({
        next: () => location.reload()
      })
    }
  }

  ngOnInit() {

    this.control = this.fb.group({
      ricerca: new FormControl('')
    });

    this.apiUtenti()

    this.api.getRecapiti(3, "tipologia").subscribe(
      x => this.email = x.data)

  }
}
