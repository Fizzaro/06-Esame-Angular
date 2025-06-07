import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor, HttpHeaders, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../_servizi/auth.service';



@Injectable({
    providedIn: 'root'
})
export class AuthIntercept implements HttpInterceptor {

    token: string | null = null
    constructor(private auth:AuthService) {
     
     }

    //---------------------------------------------------------------------------------------------------------------
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let richiestaModificata = req.clone({
            headers: new HttpHeaders().set("Language","IT")
        });
        this.token = this.auth.ritornaAuth().token
        //console.log("Interceptor");
        if (this.token !== null) {
            richiestaModificata = richiestaModificata.clone({
                headers: new HttpHeaders().set("Authorization", `Bearer ${this.token}`)
                // headers: new HttpHeaders().set("Authorization", "Basic " + btoa("0:" + this.token))
            });
        }
        
        return next.handle(richiestaModificata)
    }
    //---------------------------------------------------------------------------------------------------------------
}