import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, concatMap, map, of, take } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/type/auth.type';
import { Film } from 'src/app/type/film.type';

@Component({
  selector: 'film-catalogo',
  templateUrl: './film-catalogo.component.html',
  styleUrls: ['./film-catalogo.component.scss']
})
export class FilmCatalogoComponent {

  auth$!: BehaviorSubject<Auth>
  token!: string | null
  films: Film[] = []

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.auth$ = this.authService.getSubAuth()
    this.auth$.pipe(
      map(x => {
        this.token = x.token
        // if (this.token == null) {
        //   this.router.navigateByUrl('login/access')
        // } else if (x.permesso!=='Amministratore') {
        //   this.router.navigateByUrl('home')
        // }
      }),
      concatMap(() => {
        if (this.token !== null) {
          return this.api.getFilms(null)
        } else return of({ data: null, message: null, error: null })
      }),
      take(1)
    ).subscribe({
      next: data => (data.data !== null) ? this.films = data.data : null
    })
  }
}
