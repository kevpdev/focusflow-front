import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private breakpointObserver = inject(BreakpointObserver);

  isDesktop = toSignal(
    this.breakpointObserver.observe([Breakpoints.Large, Breakpoints.XLarge]).pipe(
      tap(result => console.log(result)),
      map(result => result.matches)
    ),
    { initialValue: false }
  );
}
