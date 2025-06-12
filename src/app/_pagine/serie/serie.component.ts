import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { Card } from 'src/app/type/card.type';
import { Categoria } from 'src/app/type/categoria.type';
import { Locandina } from 'src/app/type/locandina.type';
import { Serie } from 'src/app/type/serie.type';

@Component({
  selector: 'app-serie',
  templateUrl: './serie.component.html',
  styleUrls: ['./serie.component.scss']
})
export class SerieComponent {
 private distruggi$ = new Subject<void>
   //pathFiles: string = "C:\\xampp\\htdocs\\CodexLaravel\\public\\files\\"
 
   serie: Serie[] = []
   serieSelezionata: Serie | null = null
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
 
     const idFilm = this.serie.filter((value: Serie) => value.idSerie == ev)
     this.serieSelezionata = idFilm[0]
   }
 
   ritornaCategoria(idSerieSel: number | null) {
     const cat = this.categorie.filter(cat => cat.idCategoria == idSerieSel)
     return cat[0].categoria
   }
 
   ngOnInit() {
 
     this.api.getCategorie(null).pipe(
       takeUntil(this.distruggi$)
     ).subscribe(
       x => this.categorie = x.data
     )
 
     this.api.getSeries(null).pipe(
       takeUntil(this.distruggi$)
     ).subscribe(
       x => this.serie = x.data
     )
   }
 
   ngOnDestroy() {
     this.distruggi$.next()
   }
}
