import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeManagement } from './home-management';

describe('HomeManagement', () => {
  let component: HomeManagement;
  let fixture: ComponentFixture<HomeManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
