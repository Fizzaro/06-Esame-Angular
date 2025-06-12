import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultilistCarouselComponent } from './multilist-carousel/multilist-carousel.component';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { CardComponent } from './card/card.component';
import { FirstCarouselComponent } from './first-carousel/first-carousel.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { DragDropDirective } from 'src/app/_direttive/drag-drop.directive';
import { AnteprimaDirective } from 'src/app/_direttive/anteprima.directive';

@NgModule({
  declarations: [
    MultilistCarouselComponent,
    CardComponent,
    FirstCarouselComponent,
    UploadFileComponent,
    DragDropDirective,
    AnteprimaDirective
  ],
  imports: [
    CommonModule,
    CarouselModule
  ],
  exports: [MultilistCarouselComponent,
    FirstCarouselComponent,
    CardComponent,
    UploadFileComponent
  ]
})
export class UikitModule { }
