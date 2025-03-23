import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { AuthStoreService } from '../core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'focusflow';
  public isLoggedIn = false;
  public unsubscribe$ = new Subject<void>();
  constructor(
    private authService: AuthStoreService,
    private router: Router,
    private renderer: Renderer2) { }

  public ngOnInit(): void {

    this.renderer.addClass(document.documentElement, 'light-theme');

    this.authService.isAuthenticated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        this.isLoggedIn = value;
      });
  }

  goToHome() {
    this.router.navigate(['/dashboard']);
  }


  public logout(): void {
    this.authService.logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.router.navigate(['/login']));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
  }


}
