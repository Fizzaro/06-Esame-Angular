import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilistCarouselComponent } from './multilist-carousel.component';

describe('MultilistCarouselComponent', () => {
  let component: MultilistCarouselComponent;
  let fixture: ComponentFixture<MultilistCarouselComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultilistCarouselComponent]
    });
    fixture = TestBed.createComponent(MultilistCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
