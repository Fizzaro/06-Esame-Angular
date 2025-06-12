import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { MediaqueryService } from 'src/app/_servizi/mediaquery.service';
import { Card } from 'src/app/type/card.type';

@Component({
  selector: 'multilist-carousel',
  templateUrl: './multilist-carousel.component.html',
  styleUrls: ['./multilist-carousel.component.scss']
})
export class MultilistCarouselComponent {

  activeSlideIndex = 0;
  itemsPerSlide: number = 2
  singleSlideOffset = true;

  private distruggi$ = new Subject<void>
  sub$!: BehaviorSubject<MediaQueryList>
  width: string = ''
  caricaMediaQ = true
  mediaQ!: MediaQueryList

  constructor(
    private media: MediaqueryService
  ) {

  }

  @Input() slides: Card[] = []
  @Output() idCard= new EventEmitter<number>

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.media.setSubMediaQ()
    this.modificaSlide()
  }

  //cambia numero elementi per la slide in base al dispositivo
  private modificaSlide() {
    this.caricaMediaQ = false;
    if (this.width == '(min-width: 1200px)') {
      this.itemsPerSlide = 6
    } else if (this.width == '(min-width: 900px)') {
      this.itemsPerSlide = 5
    } else if (this.width == '(min-width: 600px)') {
      this.itemsPerSlide = 3
    } else this.itemsPerSlide = 1

    setTimeout(() => {
      this.caricaMediaQ = true
    }, 100);
  }

  //passa il valore della card selezionata col mouse
  passaIdCard(ev: number) {
    this.idCard.emit(ev)
  }
 

  ngOnInit() {

    this.sub$ = this.media.getSubMediaQ()
    this.sub$.pipe(
      takeUntil(this.distruggi$)
    ).subscribe(x => {
      this.mediaQ = x
      this.width = x.media
      this.modificaSlide()
    })
  }

  ngOnDestroy() {
    this.distruggi$.next()
  }
}