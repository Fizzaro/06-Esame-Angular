import { Component } from '@angular/core';
import { Auth } from './type/auth.type';
import { AuthService } from './_servizi/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 
  constructor(
  ) {

  }
}
