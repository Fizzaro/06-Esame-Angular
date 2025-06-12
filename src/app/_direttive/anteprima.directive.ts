import { Directive, ElementRef, EventEmitter, HostListener, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[Anteprima]'
})
export class AnteprimaDirective {
  
// @Output() hover: boolean = false

  constructor(private elAnteprima: ElementRef, private rend: Renderer2) {
  }
    @HostListener('mouseenter') onMouseEnter() {
    this.highlight('highlighted');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(className: string | null) {
    if (className) {
      this.rend.addClass(this.elAnteprima.nativeElement, className);
    } else {
      this.rend.removeClass(this.elAnteprima.nativeElement, 'highlighted');
    }
  }

}
