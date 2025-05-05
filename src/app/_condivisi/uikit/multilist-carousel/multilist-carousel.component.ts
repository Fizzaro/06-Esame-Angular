import { Component, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MediaqueryService } from 'src/app/_servizi/mediaquery.service';
import { Film } from 'src/app/type/film.type';

@Component({
  selector: 'multilist-carousel',
  templateUrl: './multilist-carousel.component.html',
  styleUrls: ['./multilist-carousel.component.scss']
})
export class MultilistCarouselComponent {

  slides: { image: string; text?: string }[] = [];
  activeSlideIndex = 0;

  films: Film[] = []
  itemsPerSlide: number = 2
  singleSlideOffset = true;
  caricaMediaQ = true

  sub$: BehaviorSubject<MediaQueryList>
  width: string = ''
  mediaQ!: MediaQueryList

  constructor(
    private media: MediaqueryService
  ) {
    for (let i = 0; i < 6; i++) {
      this.addSlide();
    }

    this.sub$ = this.media.getSubMediaQ()
    this.sub$.subscribe(x => {
      this.mediaQ = x
      this.width = x.media
      this.modificaSlide()
    })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.media.setSubMediaQ()
    this.modificaSlide()

  }

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

  addSlide(): void {
    this.slides.push({
      image: `../../../assets/loc${this.slides.length % 8 + 1}.jpg`
    });
  }

  removeSlide(index?: number): void {
    const toRemove = index ? index : this.activeSlideIndex;
    this.slides.splice(toRemove, 1);
  }

}