import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MieiDatiComponent } from './miei-dati.component';

describe('MieiDatiComponent', () => {
  let component: MieiDatiComponent;
  let fixture: ComponentFixture<MieiDatiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MieiDatiComponent]
    });
    fixture = TestBed.createComponent(MieiDatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
