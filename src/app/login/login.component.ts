import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public loginForm = new FormGroup({
    email: new FormControl('',
      [Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
    password: new FormControl('',
      [Validators.required, Validators.minLength(8),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
      ])
  });

  public isAuthenticated = false;

  public errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  public ngOnInit() {

  }

  public onSubmit(): void {

    if (this.loginForm.valid) {

      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      if (!email || !password) {
        this.errorMessage = "L'email ou le mot de passe est manquant";
        return;
      }

      this.login(email, password);
    }


  }

  public login(email: string, password: string): void {
    this.authService.login(email, password).subscribe(
      user => {
        this.router.navigate(['/dashboard']);
      },
      err => {
        console.log(err.message);
        this.errorMessage = err.message;

      });
  }

}
