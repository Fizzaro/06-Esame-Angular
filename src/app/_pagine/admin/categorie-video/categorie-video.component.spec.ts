import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieVideoComponent } from './categorie-video.component';

describe('CategorieVideoComponent', () => {
  let component: CategorieVideoComponent;
  let fixture: ComponentFixture<CategorieVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieVideoComponent]
    });
    fixture = TestBed.createComponent(CategorieVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
