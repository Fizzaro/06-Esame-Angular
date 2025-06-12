import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/type/categoria.type';
import { Film } from 'src/app/type/film.type';

@Component({
  selector: 'film-catalogo',
  templateUrl: './film-catalogo.component.html',
  styleUrls: ['./film-catalogo.component.scss']
})
export class FilmCatalogoComponent {

  scheda: 'categoria' | 'nuovoFilm' | 'film' = 'film'
  active: string | null = 'active'
  private distruggi$ = new Subject<void>

  error: string | null = null
  films: Film[] = []
  filmCategorie: Film[] = []
  filesCaricati: File[] | null = null
  categorie: Categoria[] = []

  control!: FormGroup
  modificaForm!: FormGroup
  filmForm!: FormGroup

  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) {

  }

  schedaFilm() {
    this.scheda = 'film'
    this.filmTable = null
  }
  schedaFilmCategoria() {
    this.scheda = 'categoria'
    this.active = null
    this.filmTable = null
  }
  schedaFilmNuova() {
    this.scheda = 'nuovoFilm'
    this.active = null
    this.filmTable = null
  }

  conservoIdFilm: number | null = null
  filmTable: 'Modifica' | 'Elimina' | null = null

  //Files caricati dall'upload
  caricaFiles(event: File[]) {
    this.filesCaricati = event
  }

  //carica i files
  uploadFiles(formData: FormData, nameId: string) {
    if (this.filesCaricati !== null && this.filesCaricati !== undefined) {
      for (let i = 0; i < this.filesCaricati.length; i++) {
        formData.append('filesDaCaricare[]', this.filesCaricati[i], nameId + this.filesCaricati[i].name)
      }
      this.api.postUpload(formData).pipe(
        takeUntil(this.distruggi$)
      ).subscribe({
        next: x => {
          this.error = x.message
          location.reload()
        },
        error: () => this.error = 'Caricamento file fallito!'
      })
    }
  }

  //Setta i campi del form con quelli del film selezionato
  cambiaFilm(azione: 'Modifica' | 'Elimina' | null, film: Film) {
    (this.filmTable == null || this.filmTable !== azione) ? this.filmTable = azione : this.filmTable = null
    const form = this.modificaForm.controls
    form['titolo'].setValue(film.titolo)
    form['descrizione'].setValue(film.descrizione)
    form['durataMinuti'].setValue(film.durata)
    form['regista'].setValue(film.regista)
    form['produttore'].setValue(film.produttore)
    form['attori'].setValue(film.attori)
    form['categoria'].setValue(film.idCategoria)
    form['dataUscita'].setValue(film.annoUscita)

    this.conservoIdFilm = film.idFilm
  }

  //Crea un nuovo film
  nuovoFilm() {
    const formData = new FormData()

    const form = this.filmForm.controls
    const modificato: Partial<Film> = {
      titolo: form['titolo'].value,
      descrizione: form['descrizione'].value,
      durata: form['durataMinuti'].value,
      regista: form['regista'].value,
      produttore: form['produttore'].value,
      attori: form['attori'].value,
      idCategoria: form['categoria'].value,
      annoUscita: form['dataUscita'].value,
      idLocandina: 0,
      idTrailer: 0,
      idVideo: 0
    }
    this.api.postFilms(modificato).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      (x) => {
        const film: Film = x.data
        const name = 'film' + film.idFilm + '_'
        this.uploadFiles(formData, name)
      })
  }

  //Modifica o elimina un film
  formFilm() {
    const formData = new FormData()
    const form = this.modificaForm.controls
    if (this.filmTable == "Modifica") {
      const modificato: Partial<Film> = {
        titolo: form['titolo'].value,
        descrizione: form['descrizione'].value,
        durata: form['durataMinuti'].value,
        regista: form['regista'].value,
        produttore: form['produttore'].value,
        attori: form['attori'].value,
        idCategoria: form['categoria'].value,
        annoUscita: form['dataUscita'].value
      }
      if (this.conservoIdFilm !== null) {
        this.api.putFilms(this.conservoIdFilm, modificato).pipe(
          takeUntil(this.distruggi$)
        ).subscribe(
          (x) => {
            const film: Film = x.data
            const name = film.idFilm + '_'
            this.uploadFiles(formData, name)
            location.reload()
          })
      }
    } else if (this.filmTable == "Elimina") {
      if (this.conservoIdFilm !== null) {
        this.api.deleteFilms(this.conservoIdFilm).pipe(
          takeUntil(this.distruggi$)
        ).subscribe(() => location.reload())
      }
    }
  }

  //Restituisce i film per categoria
  apiFilmCategoria(cat: number | null) {
    this.api.getFilms(null, cat).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      x => this.filmCategorie = x.data)
  }

  //carica i film
  apiFilm() {
    const titolo = this.control.controls['ricerca'].value
    if (titolo) {
      this.api.getFilms(titolo).pipe(
        takeUntil(this.distruggi$)
      ).subscribe(
        x => {
          this.films = x.data
        })
    } else {
      this.api.getFilms(null).pipe(
        takeUntil(this.distruggi$)
      ).subscribe(
        x => this.films = x.data
      )
    }
  }

  ngOnInit() {

    this.control = this.fb.group({
      ricerca: new FormControl('')
    });

    this.apiFilm()

    this.api.getCategorie(null).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      x => this.categorie = x.data
    )

    //Form di registrazione Serie
    this.filmForm = this.fb.group({
      titolo: new FormControl('', [Validators.required]),
      descrizione: new FormControl('', [Validators.required]),
      durataMinuti: new FormControl('', [Validators.required]),
      regista: new FormControl('', [Validators.required]),
      produttore: new FormControl('', [Validators.required]),
      attori: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      dataUscita: new FormControl('', [Validators.required])
    })

    //Form di modifica Serie
    this.modificaForm = this.fb.group({
      titolo: new FormControl('', [Validators.required]),
      descrizione: new FormControl('', [Validators.required]),
      durataMinuti: new FormControl('', [Validators.required]),
      regista: new FormControl('', [Validators.required]),
      produttore: new FormControl('', [Validators.required]),
      attori: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      dataUscita: new FormControl('', [Validators.required])
    })
  }

  ngOnDestroy() {
    this.distruggi$.next()
  }

}
