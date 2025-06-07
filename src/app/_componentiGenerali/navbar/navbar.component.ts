import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, interval, map, Observable, of, Subject, switchMap, takeUntil, TimeInterval } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/type/auth.type';
import { Utente } from 'src/app/type/utente.type';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  auth$!: BehaviorSubject<Auth>
  utenteAuth!: Auth
  utente!: Utente
  data!: number
  contoRovescia!: any
  accesso!: any

  constructor(
    private api: ApiService,
    private authService: AuthService,
    private router: Router
  ) {

  }

  /**
   * Funzione per convertire i millisecondi in hh:mm:ss
   * @param msDurata Durata in millisecondi
   * @returns string
   */
  msToTime(msDurata: number): string {
    //let millisecondi = (msDurata%1000)/100
    let secondi = (msDurata / 1000) % 60
    let minuti = (msDurata / (1000 * 60)) % 60
    let ore = (msDurata / (1000 * 60 * 60)) % 24

    ore = (ore < 10) ? 0 + ore : ore
    minuti = (minuti < 10) ? 0 + minuti : minuti
    secondi = (secondi < 10) ? 0 + secondi : secondi

    //arrotondo per difetto e aggiungo lo zero davanti alle cifre singole
    return Math.trunc(ore) + ':' + ((Math.trunc(minuti).toString()).padStart(2, '0')) + ':' + ((Math.trunc(secondi)).toString()).padStart(2, '0')
  }

  logout() {
    this.authService.eliminaAuth()
    const authVuoto: Auth = {
      token: null,
      scadenza: null,
      idUtente: null,
      attivo: null,
      amministratore: null,
      membro: null,
      nomeCompleto: null
    }
    this.authService.setSubAuth(authVuoto)
    this.router.navigateByUrl('login')
  }

  ngOnInit() {

    this.auth$ = this.authService.getSubAuth()
    this.auth$.pipe(
      // uso switchMap per eliminare le richieste multiple
      switchMap(auth => {
        const id = auth.idUtente
        const scad = auth.scadenza
        if (id !== null && scad !== null && scad > (Date.now() / 1000)) {
          const scadenza = (scad * 1000)
          this.contoRovescia = interval(1000).pipe(
            map(() => this.msToTime(scadenza - Date.now()) ))
          return this.api.getUtente(id).pipe(
            map(ris => ({
              auth, ris
            }))
          );
        } else {
          (scad !== null && scad < (Date.now() / 1000)) ? this.logout() : null
          // restituisce lo stesso oggetto ma con tutti i dati nulli
          return of({
            auth,
            ris: { data: null }
          });
        }
      })
    ).subscribe({
      next: data => {
        this.utenteAuth = data.auth
        this.utente = data.ris.data
      },
      error: err => {
        console.error('Errore nella catena API:', err);
      }
    })

  }

}
