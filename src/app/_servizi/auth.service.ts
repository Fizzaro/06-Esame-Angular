import { Injectable } from '@angular/core';
import { Auth } from '../type/auth.type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  static auth: Auth
  private authSub$: BehaviorSubject<Auth>

  constructor() {
    AuthService.auth = this.ritornaAuth()
    this.authSub$ = new BehaviorSubject<Auth>(AuthService.auth)
  }

  /**
   * Funzione che restituisce l'auth col Subject
   * @returns BehaviorSubject<Auth>
   */
  getSubAuth(): BehaviorSubject<Auth> {
    return this.authSub$
  }

  /**
   * Funzione per settare l'auth da emettere col Subject
   * @param dati Auth
   */
  setSubAuth(dati: Auth): void {
    AuthService.auth = dati
    this.authSub$.next(dati)
  }

  /**
   * Funzione per salvare sul local storage l'auth
   * @param auth oggetto da convertire in stringa e salvare
   */
  salvaAuthLocalStorage(auth: Auth): void {
    localStorage.setItem("auth", JSON.stringify(auth))
  }

  /**
   * Funzione per salvare sul session storage l'auth
   * @param auth oggetto da convertire in stringa e salvare
   */
  salvaAuthSessionStorage(auth: Auth): void {
    sessionStorage.setItem("auth", JSON.stringify(auth))
  }

  /**
   * Funzione per eliminare l'auth sia dal local che dal session storage
   */
  eliminaAuth() {
    localStorage.removeItem('auth')
    sessionStorage.removeItem('auth')
  }

  /**
   * Funzione per leggere dal local storage l'auth
   * @returns object convertito da string | null
   */
  leggiAuthLocalStorage(): Auth | null {
    const tmp: string | null = localStorage.getItem("auth")
    return (tmp !== null) ? JSON.parse(tmp) : null
  }

  /**
   * Funzione per leggere dal session storage l'auth
   * @returns object convertito da string | null
   */
  leggiAuthSessionStorage(): Auth | null {
    const tmp: string | null = sessionStorage.getItem("auth");
    return (tmp !== null) ? JSON.parse(tmp) : null
  }

  /**
   * Funzione che ritorna l'auth
   * @returns object Auth
   */
  ritornaAuth(): Auth {
    let tmp = this.leggiAuthLocalStorage()
    if (tmp !== null) {
      return tmp
    } else {
      tmp = this.leggiAuthSessionStorage()
      if (tmp !== null) {
        return tmp
      } else return {
        token: null,
        scadenza: null,
        idUtente: null,
        attivo: null,
        amministratore: null,
        membro: null,
        nomeCompleto: null
      }
    }
  }
}
