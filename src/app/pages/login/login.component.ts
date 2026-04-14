/**
 * login.component.ts – Página de inicio de sesión del administrador.
 *
 * Formulario reactivo con validaciones (mín. 3 caracteres usuario,
 * mín. 4 caracteres contraseña). Al autenticarse correctamente
 * redirige a /admin. Incluye toggle de visibilidad de contraseña.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  form: FormGroup;
  errorMessage = '';
  submitted = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.value;
    const ok = this.authService.login(username, password);

    if (ok) {
      this.router.navigate(['/admin']);
    } else {
      this.errorMessage = 'Credenciales incorrectas. Verifica usuario y contraseña.';
    }
  }

  get f() {
    return this.form.controls;
  }
}
