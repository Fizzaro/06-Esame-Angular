import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, map, of, Subject, switchMap, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/type/auth.type';
import { Utente } from 'src/app/type/utente.type';

@Component({
  selector: 'miei-dati',
  templateUrl: './miei-dati.component.html',
  styleUrls: ['./miei-dati.component.scss']
})
export class MieiDatiComponent {

  auth$!: BehaviorSubject<Auth>
  private distruggi$ = new Subject<void>
  utenteAuth!: Auth
  utente!: Utente

  constructor(
    private api: ApiService,
    private authService: AuthService,
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
      }),
      takeUntil(this.distruggi$)
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

  ngOnDestroy() {
    this.distruggi$.next()
  }
}
