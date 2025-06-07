import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from 'src/app/_servizi/api.service';
import { AuthService } from 'src/app/_servizi/auth.service';
import { Auth } from 'src/app/type/auth.type';
import { Categoria } from 'src/app/type/categoria.type';
import { Episodio } from 'src/app/type/episodio.type';
import { Serie } from 'src/app/type/serie.type';

@Component({
  selector: 'serie-catalogo',
  templateUrl: './serie-catalogo.component.html',
  styleUrls: ['./serie-catalogo.component.scss']
})
export class SerieCatalogoComponent {

  scheda: 'categoria' | 'nuovaSerie' | 'nuovoEpisodio' | 'serie' = 'serie'
  active: string | null = 'active'

  auth$!: BehaviorSubject<Auth>
  token!: string | null

  series: Serie[] = []
  filesCaricati: File[] | null = null
  categorie: Categoria[] = []
  episodi: Episodio[] = []

  serieForm!: FormGroup
  episodioForm!: FormGroup
  categoriaForm!: FormGroup
  selectForm!: FormGroup

  constructor(
    private authService: AuthService,
    private api: ApiService,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  schedaCategoria() {
    this.scheda = 'categoria'
    this.active = null
  }
  schedaSerieNuova() {
    this.scheda = 'nuovaSerie'
    this.active = null
  }
  schedaEpisodioNuovo() {
    this.scheda = 'nuovoEpisodio'
    this.active = null
  }

  categoriaTable: 'Nuova' | 'Modifica' | 'Elimina' | null = 'Nuova'
    //proprietà per salvare l'id della categoria da modificare o eliminare
    conservoIdCategoria: number | null = null

    //Trova e restituisce il corrispettivo id dalla sua categoria 
  generaIdCategoria(categoria: string | null) {
    let result = null
    this.categorie.forEach(x => {
      if (x.categoria == categoria) {
        result = x.idCategoria
      }
    })
    return result
  }
  
    //Visualizza e assegna i valori al form delle categorie da aggiungere
    apriCategoria() {
      this.categoriaTable = 'Nuova'
      this.categoriaForm.controls['categoria'].setValue('')
    }
  
     //Visualizza e assegna i valori al form delle categorie da modificare
    modificaCategoria(categoria: Categoria | null) {
      this.categoriaTable = 'Modifica'
      if (categoria!==null && categoria!==undefined) {
        this.categoriaForm.controls['categoria'].setValue(categoria.categoria)
      }
    }

    //Visualizza e assegna i valori al form delle categorie da eliminare
    eliminaCategoria(categoria: Categoria | null) {
      this.categoriaTable = 'Elimina'
      if (categoria!==null && categoria!==undefined) {
        this.categoriaForm.controls['categoria'].setValue(categoria.categoria)
      }
    }
     
    //Crea una nuova categoria o la modifica o la elimina
    formCategoria() {
      const form = this.categoriaForm.controls
      if (this.categoriaTable == "Modifica") {
        const modificato: Partial<Categoria> = {
          idCategoria: this.generaIdCategoria(form['categoria'].value),
          categoria: form['categoria'].value,
        }
        if (this.conservoIdCategoria !== null) {
          this.api.putCategorie(this.conservoIdCategoria, modificato).subscribe(() => window.location.reload())
        }
      } else if (this.categoriaTable == "Nuova") {
        const nuovo: Partial<Categoria> = {
          categoria: form['categoria'].value
        }
        this.api.postCategorie(nuovo).subscribe(() => window.location.reload())
      } else if (this.categoriaTable == "Elimina") {
        if (this.conservoIdCategoria !== null) {
          this.api.deleteCategorie(this.conservoIdCategoria).subscribe(() => window.location.reload())
        }
      }
    }
  ngOnInit() {

    this.api.getSeries(null).subscribe(
      x => this.series = x.data
    )
    this.api.getCategorie(null).subscribe(
      x => this.categorie = x.data
    )
    this.api.getEpisodi(null).subscribe(
      x => this.episodi = x.data
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
      totStagioni: new FormControl('', [Validators.required])
    })

    //Form di registrazione Episodio
    this.episodioForm = this.fb.group({
      titolo: new FormControl('', [Validators.required]),
      descrizione: new FormControl('', [Validators.required]),
      regista: new FormControl('', [Validators.required]),
      produttore: new FormControl('', [Validators.required]),
      attori: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      dataUscita: new FormControl('', [Validators.required]),
      dataFine: new FormControl('', [Validators.required]),
      totStagioni: new FormControl('', [Validators.required])
    })

    //Form delle categorie
    this.categoriaForm = this.fb.group({
      categoria: new FormControl('', [Validators.required, Validators.maxLength(40)])
    })

    //Form select
    this.selectForm = this.fb.group({
      categoria: new FormControl('', [Validators.required])
    })
  }

  //Files caricati dall'upload
  caricaFiles(event: File[]) {
    this.filesCaricati = event
  }

  inviaForm() {

  }
}
