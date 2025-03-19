import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {

  constructor(private breakpointObserver: BreakpointObserver) { }

  /**
   * Defines if the screen is small
   * @returns An observable emitting true if the screen is small
   */
  isSmallScreen(): Observable<boolean> {
    return this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .pipe(map(result => result.matches));
  }
}
