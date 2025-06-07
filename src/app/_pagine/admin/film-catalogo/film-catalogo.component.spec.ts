import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmCatalogoComponent } from './film-catalogo.component';

describe('FilmCatalogoComponent', () => {
  let component: FilmCatalogoComponent;
  let fixture: ComponentFixture<FilmCatalogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FilmCatalogoComponent]
    });
    fixture = TestBed.createComponent(FilmCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
