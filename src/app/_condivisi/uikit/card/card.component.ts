import { Component, Input } from '@angular/core';
import { Card } from 'src/app/type/card.type';

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {

  @Input() anteprima: Card | null = null

}
