import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultilistCarouselComponent } from './multilist-carousel/multilist-carousel.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CardComponent } from './card/card.component';



@NgModule({
  declarations: [
    MultilistCarouselComponent,
    CardComponent
  ],
  imports: [
    CommonModule,
    CarouselModule
  ],
  exports: [MultilistCarouselComponent]
})
export class UikitModule { }
