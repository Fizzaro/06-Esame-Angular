import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/type/categoria.type';
import { Serie } from 'src/app/type/serie.type';

@Component({
  selector: 'serie-catalogo',
  templateUrl: './serie-catalogo.component.html',
  styleUrls: ['./serie-catalogo.component.scss']
})
export class SerieCatalogoComponent {

  scheda: 'categoria' | 'nuovaSerie' | 'serie' = 'serie'
  active: string | null = 'active'
  private distruggi$ = new Subject<void>

  error: string | null = null
  series: Serie[] = []
  serieCategorie: Serie[] = []
  filesCaricati: File[] | null = null
  categorie: Categoria[] = []

  control!: FormGroup
  modificaForm!: FormGroup
  serieForm!: FormGroup

  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) {

  }

  schedaSerie() {
    this.scheda = 'serie'
    this.serieTable = null
  }
  schedaSerieCategoria() {
    this.scheda = 'categoria'
    this.active = null
    this.serieTable = null
  }
  schedaSerieNuova() {
    this.scheda = 'nuovaSerie'
    this.active = null
    this.serieTable = null
  }

  conservoIdSerie: number | null = null
  serieTable: 'Modifica' | 'Elimina' | null = null


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

  //Setta i campi del form con quelli della serie selezionata
  cambiaSerie(azione: 'Modifica' | 'Elimina' | null, serie: Serie) {
    (this.serieTable == null || this.serieTable !== azione) ? this.serieTable = azione : this.serieTable = null
    const form = this.modificaForm.controls
    form['titolo'].setValue(serie.titolo)
    form['descrizione'].setValue(serie.descrizione)
    form['regista'].setValue(serie.regista)
    form['produttore'].setValue(serie.produttore)
    form['attori'].setValue(serie.attori)
    form['descrizione'].setValue(serie.descrizione)
    form['categoria'].setValue(serie.idCategoria)
    form['dataUscita'].setValue(serie.annoUscita)
    form['dataFine'].setValue(serie.annoFine)
    form['totStagioni'].setValue(serie.totStagioni)
    form['totEpisodi'].setValue(serie.totEpisodi)

    this.conservoIdSerie = serie.idSerie
  }

  //Crea una nuova serie
  nuovaSerie() {
    const formData = new FormData()

    const form = this.serieForm.controls
    const modificato: Partial<Serie> = {
      titolo: form['titolo'].value,
      descrizione: form['descrizione'].value,
      regista: form['regista'].value,
      produttore: form['produttore'].value,
      attori: form['attori'].value,
      idCategoria: form['categoria'].value,
      annoUscita: form['dataUscita'].value,
      annoFine: form['dataFine'].value,
      totStagioni: form['totStagioni'].value,
      totEpisodi: form['totEpisodi'].value,
      idLocandina: 0,
      idTrailer: 0
    }
    this.api.postSeries(modificato).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      (x) => {
        const serie: Serie = x.data
        const name = 'serie' + serie.idSerie + '_'
        this.uploadFiles(formData, name)
      })
  }

  //Modifica o elimina una serie
  formSerie() {
    const formData = new FormData()
    const form = this.modificaForm.controls
    if (this.serieTable == "Modifica") {
      const modificato: Partial<Serie> = {
        titolo: form['titolo'].value,
        descrizione: form['descrizione'].value,
        regista: form['regista'].value,
        produttore: form['produttore'].value,
        attori: form['attori'].value,
        idCategoria: form['categoria'].value,
        annoUscita: form['dataUscita'].value,
        annoFine: form['dataFine'].value,
        totStagioni: form['totStagioni'].value,
        totEpisodi: form['totEpisodi'].value
      }
      if (this.conservoIdSerie !== null) {
        this.api.putSeries(this.conservoIdSerie, modificato).pipe(
          takeUntil(this.distruggi$)
        ).subscribe(
          (x) => {
            const serie: Serie = x.data
            const name = serie.idSerie + '_'
            this.uploadFiles(formData, name)
            location.reload()
          })
      }
    } else if (this.serieTable == "Elimina") {
      if (this.conservoIdSerie !== null) {
        this.api.deleteSeries(this.conservoIdSerie).pipe(
          takeUntil(this.distruggi$)
        ).subscribe(() => location.reload())
      }
    }
  }

  //Restituisce le serie per categoria
  apiSerieCategoria(cat: number | null) {
    this.api.getSeries(null, cat).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      x => this.serieCategorie = x.data)
  }

  //carica le serie
  apiSerie() {
    const titolo = this.control.controls['ricerca'].value
    if (titolo) {
      this.api.getSeries(titolo).pipe(
        takeUntil(this.distruggi$)
      ).subscribe(
        x => {
          this.series = x.data
        })
    } else {
      this.api.getSeries(null).pipe(
        takeUntil(this.distruggi$)
      ).subscribe(
        x => this.series = x.data
      )
    }
  }

  ngOnInit() {

    this.control = this.fb.group({
      ricerca: new FormControl('')
    });

    this.apiSerie()

    this.api.getCategorie(null).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      x => this.categorie = x.data
    )

    //Form di registrazione Serie
    this.serieForm = this.fb.group({
      titolo: new FormControl('', [Validators.required]),
      descrizione: new FormControl('', [Validators.required]),
      regista: new FormControl('', [Validators.required]),
      produttore: new FormControl('', [Validators.required]),
      attori: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      dataUscita: new FormControl('', [Validators.required]),
      dataFine: new FormControl('', [Validators.required]),
      totStagioni: new FormControl('', [Validators.required]),
      totEpisodi: new FormControl('', [Validators.required])
    })

    //Form di modifica Serie
    this.modificaForm = this.fb.group({
      titolo: new FormControl('', [Validators.required]),
      descrizione: new FormControl('', [Validators.required]),
      regista: new FormControl('', [Validators.required]),
      produttore: new FormControl('', [Validators.required]),
      attori: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      dataUscita: new FormControl('', [Validators.required]),
      dataFine: new FormControl('', [Validators.required]),
      totStagioni: new FormControl('', [Validators.required]),
      totEpisodi: new FormControl('', [Validators.required])
    })
  }

  ngOnDestroy() {
    this.distruggi$.next()
  }

}
