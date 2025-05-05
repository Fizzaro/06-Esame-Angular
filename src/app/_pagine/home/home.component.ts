
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, delay, map, take, tap } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/type/auth.type';
import { Film } from 'src/app/type/film.type';

@Component({
  selector: 'home',
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
    private api: ApiService,
    private router: Router
  ) {
    this.auth$ = this.authService.getSubAuth()
    this.auth$.pipe(
      map(x => {
        this.token = x.token
        if (this.token==null) {
          this.router.navigateByUrl('login/access')
        } else {
          setTimeout(()=>this.apiFilm(), 500)
        }
      })
    ).subscribe()


    for (let i = 0; i < 4; i++) {
      this.addSlide();
    }
  }

  apiFilm() {
    this.api.getFilms(null).pipe(
      take(1),
      tap(x => console.log("apriFilm", x))
    ).subscribe(x => this.films = x.data)
  }

  addSlide(): void {
    this.slides.push({
      image: `../../../assets/loc${this.slides.length % 8 + 1}.jpg`
    });
  }

  removeSlide(index?: number): void {
    const toRemove = index ? index : this.activeSlideIndex;
    this.slides.splice(toRemove, 1);
  }
}