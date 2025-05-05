import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaqueryService {
  private mqSmart: MediaQueryList = window.matchMedia('(min-width: 300px)');
  private mqTablet: MediaQueryList = window.matchMedia('(min-width: 600px)');
  private mqLaptop: MediaQueryList = window.matchMedia('(min-width: 900px)');
  private mqMonitor: MediaQueryList = window.matchMedia('(min-width: 1200px)');

  private subj$: BehaviorSubject<MediaQueryList> = new BehaviorSubject(this.mediaMatch())
  
  private mediaMatch(): MediaQueryList {
    if (this.mqMonitor.matches) {
      return this.mqMonitor
    } else if (this.mqLaptop.matches) {
      return this.mqLaptop
    } else if (this.mqTablet.matches) {
      return this.mqTablet
    } else {
      return this.mqSmart
    }
  }
  
  constructor() { }

  getSubMediaQ(): BehaviorSubject<MediaQueryList> {
    return this.subj$
  }

  setSubMediaQ(): void {
    this.subj$.next(this.mediaMatch())
  }

}
