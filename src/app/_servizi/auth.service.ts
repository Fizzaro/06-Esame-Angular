import { Injectable } from '@angular/core';
import { Auth } from '../type/auth.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static auth:Auth
  loggato: boolean =false
  private authSub$:BehaviorSubject<Auth>

  constructor() {
    AuthService.auth=this.leggiAuthLocalStorage()
    this.authSub$=new BehaviorSubject<Auth>(AuthService.auth)
  }

  //Restituisce l'auth con un Subject
  getSubAuth():BehaviorSubject<Auth> {
    return this.authSub$
  }

  //Gli passa i dati per settare l'auth da emettere col Subject
  setSubAuth(dati:Auth):void {
    AuthService.auth=dati
    this.authSub$.next(dati)
  }

  /**
   * Funzione per salvare sul local storage l'auth
   * @param auth oggetto da convertire in stringa e salvare
   */
  salvaAuthLocalStorage(auth:Auth):void {
    localStorage.setItem("auth", JSON.stringify(auth))
  }

  /**
   * Funzione per leggere dal local storage l'auth
   * @returns object convertito da string
   */
  leggiAuthLocalStorage():Auth {
    const tmp:string|null = localStorage.getItem("auth")
    let auth:Auth
    if (tmp !== null) {
      this.loggato=true
      return auth=JSON.parse(tmp)
    } else {
      this.loggato=false
      return auth= {
        token: null,
        idUtente: null,
        stato: null,
        permesso: null,
        azioni: null,
        nomeCompleto: null
      }
    }
  }

}
