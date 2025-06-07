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
import { Indirizzo } from '../type/indirizzo.type';
import { Recapito } from '../type/recapito.type';
import { Categoria } from '../type/categoria.type';

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
      case "PUT":
        if (parametri !== null) {
          return this.http.put<IRispostaServer>(url, parametri)
        } else {
          return new Observable<IRispostaServer>(Subscriber => Subscriber.next({ 'data': null, 'message': null, 'error': "NO_PARAMETRO" }))
        }
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
      map(x => {
        const sale = x.data.sale
        const cifrata = UtilityService.cifraPssw(hashPssw, sale)
        return cifrata
      }),
      concatMap(cifrata => this.getLogin2(hashUsername, cifrata))
    )
  }

  public modificaPassword(idUtente:number, vecchiaPassword:string, nuovaPassword:string): Observable<IRispostaServer> {
    return this.httpGenerica(['accedi', idUtente, vecchiaPassword, nuovaPassword], "GET")
  }

  /*************** API UTENTE *****************/

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
      return this.httpGenerica(["utenti?cerca=", utente], "GET")
    } else if (typeof utente === 'number') {
      if (statoPermesso == null) {
        return this.httpGenerica(["utenti", utente], "GET")
      } else return this.httpGenerica(["utenti", statoPermesso, utente], "GET")
    } else {
      return this.httpGenerica(["utenti"], "GET")
    }
  }

  /**
   * Api per eliminare gli utenti
   * @param idUtente number
   * @returns Observable<IRispostaServer>
   */
  public deleteUtenti(idUtente: number): Observable<IRispostaServer> {
    return this.httpGenerica(["utenti", idUtente], "DELETE")
  }

  public cambiaPermesso(idUtente: number, tipoPermesso: "amministratore" | "membro" | "ospite"): Observable<IRispostaServer> {
    return this.httpGenerica(['utenti', tipoPermesso, idUtente], "GET")
  }

  public cambiaStato(idUtente: number, tipoStato: "attiva" | "disattiva" | "sospendi"): Observable<IRispostaServer> {
    return this.httpGenerica(['utenti', tipoStato, idUtente], "GET")
  }


  /*************** API FILM E CATEGORIE *****************/

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
   * Api per caricare le categorie
   * @param categoria string per la ricerca di una categoria | number come id di una categoria
   * @returns Observable<IRispostaServer>
   */
  public getCategorie(categoria: string | number | null): Observable<IRispostaServer> {
    if (typeof categoria === 'string') {
      return this.httpGenerica(["categorie?", categoria], "GET")
    } else if (typeof categoria === 'number') {
      return this.httpGenerica(["categorie", categoria], "GET")
    } else {
      return this.httpGenerica(["categorie"], "GET")
    }
  }

    /**
   * Api per creare le categorie
   * @param Partial<Categoria> payload con dati 
   * @returns Observable<IRispostaServer>
   */
  public postCategorie(categoria: Partial<Categoria>): Observable<IRispostaServer> {
    return this.httpGenerica(['categorie'], "POST", categoria)
  }

  /**
   * Api per modificare le categorie
   * @param idCategoria number
   * @param Partial<Categoria> payload con dati da modificare 
   * @returns Observable<IRispostaServer>
   */
  public putCategorie(idCategoria: number, categoria: Partial<Categoria>): Observable<IRispostaServer> {
    return this.httpGenerica(['categorie', idCategoria], "PUT", categoria)
  }

  /**
   * Api per eliminare le categorie
   * @param idCategoria number
   * @returns Observable<IRispostaServer>
   */
  public deleteCategorie(idCategoria: number): Observable<IRispostaServer> {
    return this.httpGenerica(['categorie', idCategoria], "DELETE")
  }


  /*************** API SERIE ED EPISODI *****************/

  /**
   * Api per caricare le serie
   * @param serie string per la ricerca di una serie | number come id di una serie
   * @returns Observable<IRispostaServer>
   */
  public getSeries(serie: string | number | null): Observable<IRispostaServer> {
    if (typeof serie === 'string') {
      return this.httpGenerica(["series?", serie], "GET")
    } else if (typeof serie === 'number') {
      return this.httpGenerica(["series", serie], "GET")
    } else {
      return this.httpGenerica(["series"], "GET")
    }
  }


  /**
   * Api per caricare gli episodi
   * @param id number
   * @param serieEpisodi per la ricerca secondo la serie
   * @returns Observable<IRispostaServer>
   */
  public getEpisodi(id: number | null, serieEpisodi: 'serie' | null = null): Observable<IRispostaServer> {
    if (typeof id === 'number') {
      if (serieEpisodi == null) {
        return this.httpGenerica(["episodi", id], "GET")
      } else return this.httpGenerica(["episodi", serieEpisodi, id], "GET")
    } else {
      return this.httpGenerica(["episodi"], "GET")
    }
  }

  /*************** API COMUNI, INDIRIZZI E RECAPITI *****************/

  /**
   * Api per caricare gli indirizzi
   * @param id number
   * @param tipologiaUtente per la ricerca secondo la tipologia o l'utente
   * @returns Observable<IRispostaServer>
   */
  public getIndirizzi(id: number | null, tipologiaUtente: 'tipologia' | 'utente' | null = null): Observable<IRispostaServer> {
    if (typeof id === 'number') {
      if (tipologiaUtente == null) {
        return this.httpGenerica(["indirizzi", id], "GET")
      } else return this.httpGenerica(["indirizzi", tipologiaUtente, id], "GET")
    } else {
      return this.httpGenerica(["indirizzi"], "GET")
    }
  }

  /**
   * Api per creare gli indirizzi
   * @param Partial<Indirizzo> payload con dati 
   * @returns Observable<IRispostaServer>
   */
  public postIndirizzi(indirizzo: Partial<Indirizzo>): Observable<IRispostaServer> {
    return this.httpGenerica(['indirizzi'], "POST", indirizzo)
  }

  /**
   * Api per modificare gli indirizzi
   * @param idIndirizzo number
   * @param Partial<Indirizzo> payload con dati da modificare 
   * @returns Observable<IRispostaServer>
   */
  public putIndirizzi(idIndirizzo: number, indirizzo: Partial<Indirizzo>): Observable<IRispostaServer> {
    return this.httpGenerica(['indirizzi', idIndirizzo], "PUT", indirizzo)
  }

  /**
   * Api per eliminare gli indirizzi
   * @param idIndirizzo number
   * @returns Observable<IRispostaServer>
   */
  public deleteIndirizzi(idIndirizzo: number): Observable<IRispostaServer> {
    return this.httpGenerica(['indirizzi', idIndirizzo], "DELETE")
  }

  /**
   * Api per caricare i recapiti
   * @param id number
   * @param tipologiaUtente per la ricerca secondo la tipologia o l'utente
   * @returns Observable<IRispostaServer>
   */
  public getRecapiti(id: number | null, tipologiaUtente: 'tipologia' | 'utente' | null = null): Observable<IRispostaServer> {
    if (typeof id === 'number') {
      if (tipologiaUtente == null) {
        return this.httpGenerica(["recapiti", id], "GET")
      } else return this.httpGenerica(["recapiti", tipologiaUtente, id], "GET")
    } else {
      return this.httpGenerica(["recapiti"], "GET")
    }
  }

  /**
     * Api per creare i recapiti
     * @param Partial<Recapito> payload con dati 
     * @returns Observable<IRispostaServer>
     */
  public postRecapiti(recapito: Partial<Recapito>): Observable<IRispostaServer> {
    return this.httpGenerica(['recapiti'], "POST", recapito)
  }

  /**
   * Api per modificare i recapiti
   * @param idRecapito number
   * @param Partial<Recapito> payload con dati da modificare 
   * @returns Observable<IRispostaServer>
   */
  public putRecapiti(idRecapito: number, recapito: Partial<Recapito>): Observable<IRispostaServer> {
    return this.httpGenerica(['recapiti', idRecapito], "PUT", recapito)
  }

  /**
   * Api per eliminare i recapiti
   * @param idRecapito number
   * @returns Observable<IRispostaServer>
   */
  public deleteRecapiti(idRecapito: number): Observable<IRispostaServer> {
    return this.httpGenerica(['recapiti', idRecapito], "DELETE")
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
}
