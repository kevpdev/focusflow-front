import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services';
import { AuthStateService } from '../core/services/auth-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'focusflow';
  public isLoggedIn = false;

  constructor(private authStateService: AuthStateService, private authService: AuthService, private router: Router) { }

  public ngOnInit(): void {
    this.authStateService.isAuthenticated$
      .subscribe((value) => {
        this.isLoggedIn = value;
      });
  }

  public logout(): void {
    this.authService.logout()
      .subscribe(() => this.router.navigate(['/login']));
  }


}
