import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { SidebarMenuComponent } from 'src/shared/components/ui/sidebar-menu/sidebar-menu.component';
import { AuthStoreService, ResponsiveService } from '../core/services';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    TranslateModule,
    CommonModule,
    SidebarMenuComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'focusflow';
  isLoggedIn = false;
  isDesktop = this.responsiveService.isDesktop;
  unsubscribe$ = new Subject<void>();

  constructor(
    private authService: AuthStoreService,
    private router: Router,
    private renderer: Renderer2,
    private responsiveService: ResponsiveService
  ) {}

  public ngOnInit(): void {
    this.renderer.addClass(document.documentElement, 'light-theme');

    this.authService.isAuthenticated$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.isLoggedIn = value;
    });
  }

  goToHome() {
    if (this.isLoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  public logout(): void {
    this.authService
      .logout()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => this.router.navigate(['/login']));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.complete();
    this.unsubscribe$.next();
  }
}
