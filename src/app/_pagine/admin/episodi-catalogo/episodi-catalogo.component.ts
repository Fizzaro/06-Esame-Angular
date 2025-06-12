import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { Episodio } from 'src/app/type/episodio.type';
import { Serie } from 'src/app/type/serie.type';

@Component({
  selector: 'app-episodi-catalogo',
  templateUrl: './episodi-catalogo.component.html',
  styleUrls: ['./episodi-catalogo.component.scss']
})
export class EpisodiCatalogoComponent {
scheda: 'episodio' | 'episodioSerie' | 'episodioNuovo' = 'episodio'
  active: string | null = 'active'
  private distruggi$ = new Subject<void>

  error: string | null = null
  series: Serie[] = []
  filesCaricati: File[] | null = null
  episodi: Episodio[] = []
  episodiSerie: Episodio[]=[]

  control!: FormGroup
  modificaForm!: FormGroup
  episodioForm!: FormGroup

  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) {

  }

  schedaEpisodio() {
    this.scheda='episodio'
    this.episodioTable=null
  }
  schedaEpisodioSerie() {
    this.scheda = 'episodioSerie'
    this.episodioTable=null
    this.active = null
  }
  schedaEpisodioNuovo() {
    this.scheda = 'episodioNuovo'
    this.episodioTable=null
    this.active = null
  }

  //Files caricati dall'upload
  caricaFiles(event: File[]) {
    this.filesCaricati = event
  }

  conservoIdEpisodio: number | null = null
  episodioTable: 'Modifica' | 'Elimina' | null = null

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

  //Setta i campi del form con quelli dell'episodio selezionato
  cambiaEpisodio(azione: 'Modifica' | 'Elimina' | null, episodio: Episodio) {
    (this.episodioTable == null || this.episodioTable !== azione) ? this.episodioTable = azione : this.episodioTable = null
    const form = this.modificaForm.controls
    form['titolo'].setValue(episodio.titolo)
    form['descrizione'].setValue(episodio.descrizione)
    form['durataMinuti'].setValue(episodio.durata)
    form['serie'].setValue(episodio.idSerie)
    form['dataUscita'].setValue(episodio.annoUscita)
    form['numStagione'].setValue(episodio.numStagione)
    form['numEpisodio'].setValue(episodio.numEpisodio)

    this.conservoIdEpisodio = episodio.idEpisodio
  }

  //Crea un nuovo episodio
  nuovoEpisodio() {
    const formData = new FormData()

    const form = this.episodioForm.controls
    const modificato: Partial<Episodio> = {
        titolo: form['titolo'].value,
        descrizione: form['descrizione'].value,
        durata: form['durataMinuti'].value,
        idSerie: form['serie'].value,
        annoUscita: form['dataUscita'].value,
        numStagione: form['numStagione'].value,
        numEpisodio: form['numEpisodio'].value,
        idVideo: 0
      }
    this.api.postEpisodi(modificato).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      (x) => {
        const episodio: Episodio = x.data
        const name = 'episodio'+episodio.idEpisodio + '_'
        this.uploadFiles(formData, name)
      })
  }

  //Modifica o elimina un episodio
  formEpisodio() {
    const formData = new FormData()
    const form = this.modificaForm.controls
    if (this.episodioTable == "Modifica") {
      const modificato: Partial<Episodio> = {
        titolo: form['titolo'].value,
        descrizione: form['descrizione'].value,
        durata: form['durataMinuti'].value,
        idSerie: form['serie'].value,
        annoUscita: form['dataUscita'].value,
        numStagione: form['numStagione'].value,
        numEpisodio: form['numEpisodio'].value
      }
      if (this.conservoIdEpisodio !== null) {
        this.api.putEpisodi(this.conservoIdEpisodio, modificato).pipe(
          takeUntil(this.distruggi$)
        ).subscribe(
          (x) => {
            const episodio: Episodio = x.data
            const name = episodio.idEpisodio + '_'
            this.uploadFiles(formData, name)
            location.reload()
          })
      }
    } else if (this.episodioTable == "Elimina") {
      if (this.conservoIdEpisodio !== null) {
        this.api.deleteEpisodi(this.conservoIdEpisodio).pipe(
          takeUntil(this.distruggi$)
        ).subscribe(() => location.reload())
      }
    }
  }

  //Restituisce gli episodi per serie
  apiEpisodioSerie(cat: number | null) {
    this.api.getEpisodi(cat, 'serie').pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      x => this.episodiSerie = x.data)
  }

  //carica gli episodi
  apiEpisodio() {
      this.api.getEpisodi(null).pipe(
        takeUntil(this.distruggi$)
      ).subscribe(
        x => this.episodi = x.data
      )
  }

  ngOnInit() {

    this.control = this.fb.group({
      ricerca: new FormControl('')
    });

    this.apiEpisodio()

    this.api.getSeries(null).pipe(
      takeUntil(this.distruggi$)
    ).subscribe(
      x => this.series = x.data
    )
    
    //Form di registrazione Episodio
    this.episodioForm = this.fb.group({
      serie: new FormControl('', [Validators.required]),
      titolo: new FormControl('', [Validators.required]),
      durataMinuti: new FormControl('', [Validators.required]),
      descrizione: new FormControl('', [Validators.required]),
      numStagione: new FormControl('', [Validators.required]),
      numEpisodio: new FormControl('', [Validators.required]),
      dataUscita: new FormControl('', [Validators.required])
    })

    //Form di modifica Episodio
    this.modificaForm=this.fb.group({
      serie: new FormControl('', [Validators.required]),
      titolo: new FormControl('', [Validators.required]),
      durataMinuti: new FormControl('', [Validators.required]),
      descrizione: new FormControl('', [Validators.required]),
      numStagione: new FormControl('', [Validators.required]),
      numEpisodio: new FormControl('', [Validators.required]),
      dataUscita: new FormControl('', [Validators.required])
    })

  }

  ngOnDestroy() {
    this.distruggi$.next()
  }

}
