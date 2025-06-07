import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieCatalogoComponent } from './serie-catalogo.component';

describe('SerieCatalogoComponent', () => {
  let component: SerieCatalogoComponent;
  let fixture: ComponentFixture<SerieCatalogoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SerieCatalogoComponent]
    });
    fixture = TestBed.createComponent(SerieCatalogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
