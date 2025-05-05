import { Injectable } from '@angular/core';
import { ChiamataHttp } from '../type/http.type';
import { HttpClient } from '@angular/common/http';
import { IRispostaServer } from '../interface/interface';
import { concatMap, from, map, Observable, of, Subscriber, take, tap } from 'rxjs';
import { UtilityService } from './utility.service';
import { sha512 } from 'js-sha512';
import { Utente } from '../type/utente.type';
import { Registra } from '../type/registra.type';
import { STRING_TYPE } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  /**
   * Funzione per calcolare la url completa per le chiamate api
   * @param risorsa Valore o collection da aggiungere alla url
   * @returns Stringa con la url completa della risorsa
   */
  protected calcolaRisorsa(risorsa: (string | number)[]): string {
    let url: string = "http://localhost/CodexLaravel/public/api"
    risorsa.forEach(x => url = url + "/" + x)
    return url
  }

  /**
   * Funzione per standardizzare le richieste api
   * @param risorsa (string | number)[] dati della risorsa da usare per le api
   * @param tipo "GET" | "POST" | "PUT" | "DELETE"
   * @param parametri (Object | null) da usare solo per POST e PUT
   * @returns Observable<IRispostaServer>
   */
  protected httpGenerica(risorsa: (string | number)[], tipo: ChiamataHttp, parametri: Object | null = null): Observable<IRispostaServer> {
    const url = this.calcolaRisorsa(risorsa)
    switch (tipo) {
      case "GET": return this.http.get<IRispostaServer>(url)
        break
      case "POST":
        if (parametri !== null) {
          return this.http.post<IRispostaServer>(url, parametri)
        } else {
          return new Observable<IRispostaServer>(Subscriber => Subscriber.next({ 'data': null, 'message': null, 'error': "NO_PARAMETRO" }))
        }
        break
      case "PUT": return this.http.put<IRispostaServer>(url, parametri)
        break
      case "DELETE": return this.http.delete<IRispostaServer>(url)
        break
    }
  }

  /**
   * Funzione per 1 fase Login
   * @param hashUsername string
   * @returns Observable<IRispostaServer>
   */
  protected getLogin1(hashUsername: string): Observable<IRispostaServer> {
    return this.httpGenerica(["accedi", hashUsername], "GET")
  }

  /**
   * Funzione per 2 fase Login
   * @param hashUsername string
   * @param hashPssw string che unisce password e sale
   * @returns Observable<IRispostaServer>
   */
  protected getLogin2(hashUsername: string, hashPssw: string): Observable<IRispostaServer> {
    return this.httpGenerica(["accedi", hashUsername, hashPssw], "GET")
  }


  /*************************************************************************
   ************************* API public
  *************************************************************************/

  /**
   * Api per il Login
   * @param username string
   * @param password string
   * @returns Observable<IRispostaServer>
   */
  public login(username: string, password: string): Observable<IRispostaServer> {
    const hashUsername: string = sha512(username)
    const hashPssw: string = sha512(password)

    return this.getLogin1(hashUsername).pipe(
      take(1),
      tap(x => console.log("Login fase 1: ", x)),
      map(x => {
        const sale = x.data.sale
        const cifrata = UtilityService.cifraPssw(hashPssw, sale)
        return cifrata
      }),
      concatMap(cifrata => this.getLogin2(hashUsername, cifrata))
    )
  }

  /**
   * Api per caricare i comuni
   * @param comune stringa per la ricerca di un comune
   * @returns Observable<IRispostaServer>
   */
  public getComuni(comune: string | null): Observable<IRispostaServer> {
    if (comune) {
      return this.httpGenerica(["comuni?", comune], "GET")
    } else {
      return this.httpGenerica(["comuni"], "GET")
    }
  }

  /**
   * Api per registrare un nuovo utente
   * @param parametri object con i dati per la registrazione
   * @returns Observable<IRispostaServer>
   */
  public postRegistraUtente(parametri: Registra): Observable<IRispostaServer> {
    return this.httpGenerica(["registra"], "POST", parametri)
  }

  /**
   * Api per caricare gli utenti
   * @param utente string per la ricerca di un utente | number come id di un utente
   * @param statoPermesso per la ricerca secondo lo stato o il permesso
   * @returns Observable<IRispostaServer>
   */
  public getUtente(utente: string | number | null, statoPermesso: 'permesso' | 'stato' | null = null): Observable<IRispostaServer> {
    if (typeof utente === 'string') {
      return this.httpGenerica(["utenti?", utente], "GET")
    } else if (typeof utente === 'number') {
      if (statoPermesso == null) {
        return this.httpGenerica(["utenti", utente], "GET")
      } else return this.httpGenerica(["utenti/", statoPermesso, utente], "GET")
    } else {
      return this.httpGenerica(["utenti"], "GET")
    }
  }

  /**
   * Api per caricare i film
   * @param film string per la ricerca di un film | number come id di un film
   * @returns Observable<IRispostaServer>
   */
  public getFilms(film: string | number | null): Observable<IRispostaServer> {
    if (typeof film === 'string') {
      return this.httpGenerica(["films?", film], "GET")
    } else if (typeof film === 'number') {
      return this.httpGenerica(["films", film], "GET")
    } else {
      return this.httpGenerica(["films"], "GET")
    }
  }

  /**
   * Api per caricare i recapiti
   * @param recapito number come id di un recapito
   * @param tipologiaUtente per la ricerca secondo la tipologia o l'utente
   * @returns Observable<IRispostaServer>
   */
  public getRecapiti(recapito: number | null, tipologiaUtente: 'tipologia' | 'utente' | null = null): Observable<IRispostaServer> {
    if (typeof recapito === 'number') {
      if (tipologiaUtente == null) {
        return this.httpGenerica(["recapiti", recapito], "GET")
      } else return this.httpGenerica(["recapiti", tipologiaUtente, recapito], "GET")
    } else {
      return this.httpGenerica(["recapiti"], "GET")
    }
  }

  /**
   * Api per caricare gli indirizzi
   * @param indirizzo number come id di un indirizzo
   * @param tipologiaUtente per la ricerca secondo la tipologia o l'utente
   * @returns Observable<IRispostaServer>
   */
  public getIndirizzi(indirizzo: number | null, tipologiaUtente: 'tipologia' | 'utente' | null = null): Observable<IRispostaServer> {
    if (typeof indirizzo === 'number') {
      if (tipologiaUtente == null) {
        return this.httpGenerica(["indirizzi", indirizzo], "GET")
      } else return this.httpGenerica(["indirizzi", tipologiaUtente, indirizzo], "GET")
    } else {
      return this.httpGenerica(["indirizzi"], "GET")
    }
  }

  /**
   * Api per caricare tutte le tipologie di indirizzo
   * @returns Observable<IRispostaServer>
   */
  public getTipologieIndirizzo(): Observable<IRispostaServer> {
    return this.httpGenerica(["tipologieIndirizzo"], "GET")
  }

  /**
   * Api per caricare tutte le tipologie di recapito
   * @returns Observable<IRispostaServer>
   */
  public getTipologieRecapito(): Observable<IRispostaServer> {
    return this.httpGenerica(["tipologieRecapito"], "GET")
  }
}
