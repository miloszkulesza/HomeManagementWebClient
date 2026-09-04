import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBar } from './menu-bar';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';

describe('MenuBar', () => {
  let component: MenuBar;
  let fixture: ComponentFixture<MenuBar>;

  beforeEach(async () => {
    window.matchMedia ??= ((query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: (): void => undefined,
      removeListener: (): void => undefined,
      addEventListener: (): void => undefined,
      removeEventListener: (): void => undefined,
      dispatchEvent: (): boolean => false
    }));

    await TestBed.configureTestingModule({
      imports: [MenuBar],
      providers: [provideHttpClient(), provideRouter([]), MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
