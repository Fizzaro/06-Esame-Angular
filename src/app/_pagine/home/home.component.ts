import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, map, take, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { IRispostaServer } from 'src/app/interface/interface';
import { Auth } from 'src/app/type/auth.type';
import { Film } from 'src/app/type/film.type';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  auth$: BehaviorSubject<Auth>
  token!: string | null

  slides: { image: string; text?: string }[] = [];
  activeSlideIndex = 0;

  films: Film[] = []

  constructor(
    private authService: AuthService,
    private apiFilm: ApiService,
    private http: HttpClient
  ) {
    this.auth$ = this.authService.getSubAuth()
    this.auth$.pipe(map(x => this.token = x.token)).subscribe()

    if (this.token !== null) {
      let headers = new HttpHeaders
      headers = headers.append('Authorization', 'Bearer ' + this.token);

      console.log(this.token)

      this.http.get<HttpEvent<IRispostaServer>>("http://localhost/CodexLaravel/public/api/films", { headers: headers }).subscribe()
    }

    this.apiFilm.getFilms(null).pipe(
    map(x => this.films = x.data),
    take(5),
    tap(x => console.log(x))
  ).subscribe()

for (let i = 0; i < 4; i++) {
  this.addSlide();
}
  }

addSlide(): void {
  this.slides.push({
    image: `../../../assets/loc${this.slides.length % 8 + 1}.jpg`
  });
}

removeSlide(index ?: number): void {
  const toRemove = index ? index : this.activeSlideIndex;
  this.slides.splice(toRemove, 1);
}
}