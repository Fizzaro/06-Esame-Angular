import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiaPasswordComponent } from './mia-password.component';

describe('MiaPasswordComponent', () => {
  let component: MiaPasswordComponent;
  let fixture: ComponentFixture<MiaPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiaPasswordComponent]
    });
    fixture = TestBed.createComponent(MiaPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
