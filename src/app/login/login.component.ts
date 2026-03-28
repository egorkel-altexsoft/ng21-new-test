import { Component, signal } from '@angular/core';
import { FormField, FormRoot, email, form, minLength, required, validateStandardSchema } from '@angular/forms/signals';

import { LoginCredentialsSchema, type LoginCredentials } from './login.schema';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected readonly model = signal<LoginCredentials>({ email: '', password: '' });

  protected onSubmit(): void {}

  protected readonly loginForm = form(
    this.model,
    (root) => {
      required(root.email, { message: 'Email is required' });
      email(root.email);
      required(root.password, { message: 'Password is required' });
      minLength(root.password, 12);
      validateStandardSchema(root, LoginCredentialsSchema);
    },
    {
      submission: {
        action: async (field) => {
          const credentials = field().value();
          console.log('Login submitted:', credentials);
          return undefined;
        }
      }
    }
  );
}
