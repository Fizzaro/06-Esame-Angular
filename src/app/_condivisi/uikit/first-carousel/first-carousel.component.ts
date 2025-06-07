import { Component } from '@angular/core';

@Component({
  selector: 'first-carousel',
  templateUrl: './first-carousel.component.html',
  styleUrls: ['./first-carousel.component.scss']
})
export class FirstCarouselComponent {
  slides: { image: string; text?: string }[] = [];
  activeSlideIndex = 0;

  constructor() {
    
    for (let i = 0; i < 4; i++) {
      this.addSlide();
    }
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
