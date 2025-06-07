import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[Pulsante]'
})
export class PulsanteDirective {

  @Input() coloreSfondo:string|null=null

  constructor(private element: ElementRef) { }

  ngAfterViewInit() {
    this.element.nativeElement.style.backgroundColor=this.coloreSfondo
  }

  @HostListener('mouseenter') mouseEnter(){
    this.element.nativeElement.style.backgroundColor="black"
  } 

  @HostListener('mouseleave') mouseLeave(){
    this.element.nativeElement.style.backgroundColor=this.coloreSfondo
  } 
}
