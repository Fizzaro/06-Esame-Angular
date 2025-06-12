import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {

  errore: string = ''
  filesDaCaricare: File[] = []
  btnInvia: boolean = true

  // Controlla i file aggiunti ogni volta
  changeInput(e: Event): void {
    const elemento = e.currentTarget as HTMLInputElement
    const files: FileList | null = elemento.files
    if (files && files !== null) {
      this.controllaFiles(files)
    }
  }

  //Elimina file caricati
  eliminaFile(fileName: string): void {
    for( let i = 0; i < this.filesDaCaricare.length; i++){ 
      if ( this.filesDaCaricare[i].name === fileName) {
        this.filesDaCaricare.splice(i, 1)
        this.errore = ''
      }
    }
    (this.filesDaCaricare.length > 0) ? null : this.btnInvia=true
  }

  //Esegue dei controlli sui file prima di caricarli
  controllaFiles(files: FileList): void {
    if (files !== null && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const extension=this.getFileExtension(files[i].name) 
        if (extension !== 'jpg' && extension !== 'mp4') {
          this.errore = 'L\'estensione di uno o più file è sbagliata'
          break
        } else if (this.fileExist(files[i].name)) {
          this.errore='Uno o più file già caricati'
          break
        } else if (files[i].size > 8 * 1024 * 1024) {
          this.errore = 'Uno o più file troppo grandi'
          break
        } else {
          this.filesDaCaricare.push(files[i])
          this.errore = ''
          this.btnInvia=false
        }
      }
    }
  }

  //Ritorna l'estensione del file o una stringa vuota
  getFileExtension(fileName: string) {
    var ext = /^.+\.([^.]+)$/.exec(fileName);
    return ext == null ? "" : ext[1];
  }

  //Controlla che il file non sia vuoto
  fileExist(fileName: string): boolean {
    let result = false
    for ( let i = 0; i < this.filesDaCaricare.length; i++) {
      if ( this.filesDaCaricare[i].name === fileName) {
        result = true
      }
    }
    return result
  }
  
   @Output() files = new EventEmitter<File[]>();

  invia() {
    this.errore='File caricati correttamente!'
    this.files.emit(this.filesDaCaricare)
    this.btnInvia=true
  }

 
}
