import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndirizziRecapitiComponent } from './indirizzi-recapiti.component';

describe('IndirizziRecapitiComponent', () => {
  let component: IndirizziRecapitiComponent;
  let fixture: ComponentFixture<IndirizziRecapitiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndirizziRecapitiComponent]
    });
    fixture = TestBed.createComponent(IndirizziRecapitiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
