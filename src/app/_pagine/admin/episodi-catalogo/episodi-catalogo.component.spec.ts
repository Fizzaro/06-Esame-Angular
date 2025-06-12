import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodiCatalogoComponent } from './episodi-catalogo.component';

describe('EpisodiCatalogoComponent', () => {
  let component: EpisodiCatalogoComponent;
  let fixture: ComponentFixture<EpisodiCatalogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EpisodiCatalogoComponent]
    });
    fixture = TestBed.createComponent(EpisodiCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
