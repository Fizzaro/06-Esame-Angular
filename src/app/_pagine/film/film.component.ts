import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { Card } from 'src/app/type/card.type';
import { Categoria } from 'src/app/type/categoria.type';
import { Film } from 'src/app/type/film.type';
import { Locandina } from 'src/app/type/locandina.type';

@Component({
  selector: 'app-film',
  templateUrl: './film.component.html',
  styleUrls: ['./film.component.scss']
})
export class FilmComponent {

  private distruggi$ = new Subject<void>
  //pathFiles: string = "C:\\xampp\\htdocs\\CodexLaravel\\public\\files\\"

  film: Film[] = []
  filmSelezionato: Film | null = null
  cardSelezionata!: Card
  partiVideo: boolean = false

  categorie: Categoria[] = []
  cardAnteprima: Card[] = [
    { idCard: 1, trailer: 'assets/film1_trailer.mp4', title: 'Titanic', image: 'assets/film1_locandina.jpg', video: 'assets/film1_video.mp4' },
    { idCard: 2, trailer: 'assets/film10_trailer.mp4', title: 'Arrow', image: 'assets/film10_locandina.jpg', video: 'assets/film10_video.mp4' },
    { idCard: 3, trailer: 'assets/film21_trailer.mp4', title: '2012', image: 'assets/film21_locandina.jpg', video: 'assets/film21_video.mp4' },
    { idCard: 4, trailer: 'assets/film51_trailer.mp4', title: 'Rocky', image: 'assets/film51_locandina.jpg', video: 'assets/film51_video.mp4' },
    { idCard: 5, trailer: 'assets/film52_trailer.mp4', title: 'Dexter', image: 'assets/film52_locandina.jpg', video: 'assets/film52_video.mp4' },
  ]
  locandineCat: Locandina[] = []

  constructor(
    private api: ApiService
  ) {

  }

  //riceve l'id della card selezionata e preleva i dati per la pagina dettaglio
  rilevaIdCard(ev: number) {
    const idCard = this.cardAnteprima.filter((value: Card) => value.idCard == ev)
    this.cardSelezionata = idCard[0]

    const idFilm = this.film.filter((value: Film) => value.idFilm == ev)
    this.filmSelezionato = idFilm[0]
  }

  ritornaCategoria(idFilmSel: number | null) {
    const cat = this.categorie.filter(cat => cat.idCategoria == idFilmSel)
    return cat[0].categoria
  }

  ngOnInit() {

    this.api.getCategorie(null).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      x => this.categorie = x.data
    )

    this.api.getFilms(null).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      x => this.film = x.data
    )
  }

  ngOnDestroy() {
    this.distruggi$.next()
  }

}