import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, Renderer2, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private breakpointObserver = inject(BreakpointObserver);

  isDesktop = toSignal(
    this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(
      tap(result => console.log(result)),
      map(result => result.matches)
    ),
    { initialValue: false }
  );

  isDarkMode = signal<boolean>(false);

  enableDarkMode(toggleDarkModeState: boolean, renderer: Renderer2): void {
    if (toggleDarkModeState) {
      localStorage.setItem('isDarkMode', 'true');
      this.isDarkMode.set(true);
    } else {
      localStorage.setItem('isDarkMode', 'false');
      this.isDarkMode.set(false);
    }
    this.setTheme(renderer);
  }

  initTheme(renderer: Renderer2): void {
    const isDarkMode = localStorage.getItem('isDarkMode');
    if (!isDarkMode) {
      localStorage.setItem('isDarkMode', 'false');
    } else {
      this.isDarkMode.set(isDarkMode === 'true');
    }

    this.setTheme(renderer);
  }

  setTheme(renderer: Renderer2): void {
    renderer.removeClass(
      document.documentElement,
      !this.isDarkMode() ? 'dark-theme' : 'light-theme'
    );
    renderer.addClass(document.documentElement, this.isDarkMode() ? 'dark-theme' : 'light-theme');
  }
}
