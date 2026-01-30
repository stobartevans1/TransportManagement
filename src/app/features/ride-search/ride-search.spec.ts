import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideSearch } from './ride-search';

describe('RideSearch', () => {
  let component: RideSearch;
  let fixture: ComponentFixture<RideSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RideSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RideSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
