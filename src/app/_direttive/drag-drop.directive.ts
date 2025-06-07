import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[DragDrop]'
})
export class DragDropDirective {

 @Output() rilascio = new EventEmitter()

  constructor(private areaDragDrop: ElementRef, private rend: Renderer2) {
  }

  @HostListener('dragover', ['$event']) onDragOver(e:DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    console.log("dragover")
    this.rend.addClass(this.areaDragDrop.nativeElement, 'dragDropHover')
  }

  @HostListener('dragleave', ['$event']) onDragLeave(e:DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    console.log('dragleave')
    this.rend.removeClass(this.areaDragDrop.nativeElement, 'dragDropHover')
  }

  @HostListener('drop', ['$event']) onDrop(e:DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer !== null && e.dataTransfer.files.length > 0) {
      this.rilascio.emit(e.dataTransfer.files)
      console.log('drop', e.dataTransfer.files)
      this.rend.removeClass(this.areaDragDrop.nativeElement, 'dragDropHover')
    }
  }
}
