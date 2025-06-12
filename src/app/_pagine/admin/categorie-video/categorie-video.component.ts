import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/_servizi/api.service';
import { Categoria } from 'src/app/type/categoria.type';

@Component({
  selector: 'app-categorie-video',
  templateUrl: './categorie-video.component.html',
  styleUrls: ['./categorie-video.component.scss']
})
export class CategorieVideoComponent {

  categorie: Categoria[] = []
  categoriaForm!: FormGroup
  selectForm!: FormGroup

  constructor(
    private api: ApiService,
    private fb: FormBuilder
  ) {

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
  nuovaCategoria() {
    this.categoriaTable = 'Nuova'
    this.categoriaForm.controls['categoria'].setValue('')
  }

  //Visualizza e assegna i valori al form delle categorie da modificare
  modificaCategoria(categoria: Categoria | null) {
    this.categoriaTable = 'Modifica'
    if (categoria !== null && categoria !== undefined) {
      this.categoriaForm.controls['categoria'].setValue(categoria.categoria)
    }
  }

  //Visualizza e assegna i valori al form delle categorie da eliminare
  eliminaCategoria(categoria: Categoria | null) {
    this.categoriaTable = 'Elimina'
    if (categoria !== null && categoria !== undefined) {
      this.categoriaForm.controls['categoria'].setValue(categoria.categoria)
    }
  }

  //Crea una nuova categoria o la modifica o la elimina
  formCategoria() {
    const categoriaForm = this.categoriaForm.controls
    const selectForm = this.selectForm.controls
    if (this.categoriaTable == "Modifica") {
      const modificato: Partial<Categoria> = {
        categoria: categoriaForm['categoria'].value,
      }
      const idCategoria= this.generaIdCategoria(selectForm['categoria'].value)
      if (idCategoria!==null) {
        this.api.putCategorie(idCategoria, modificato).subscribe(() => window.location.reload())
      }
      
    } else if (this.categoriaTable == "Nuova") {
      const nuovo: Partial<Categoria> = {
        categoria: categoriaForm['categoria'].value
      }
      this.api.postCategorie(nuovo).subscribe(() => window.location.reload())

    } else if (this.categoriaTable == "Elimina") {
      const idCategoria= this.generaIdCategoria(selectForm['categoria'].value)
      if (idCategoria !== null) {
        this.api.deleteCategorie(idCategoria).subscribe(() => window.location.reload())
      }
    }
  }

  ngOnInit() {
    this.api.getCategorie(null).subscribe(
      x => this.categorie = x.data
    )
    
    //Form delle categorie
    this.categoriaForm = this.fb.group({
      categoria: new FormControl('', [Validators.required, Validators.maxLength(40)])
    })

    //Form select
    this.selectForm = this.fb.group({
      categoria: new FormControl('', [Validators.required])
    })
  }
}
