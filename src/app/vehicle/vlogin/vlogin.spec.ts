import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Vlogin } from './vlogin';

describe('Vlogin', () => {
  let component: Vlogin;
  let fixture: ComponentFixture<Vlogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Vlogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Vlogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
