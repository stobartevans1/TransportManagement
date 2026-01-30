import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VRegister } from './vregister';

describe('VRegister', () => {
  let component: VRegister;
  let fixture: ComponentFixture<VRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
