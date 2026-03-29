import { Component, signal } from '@angular/core';
import { FormField, FormRoot, form, validateStandardSchema } from '@angular/forms/signals';

import { LoginCredentialsSchema, type LoginCredentials } from './login.schema';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  protected readonly model = signal<LoginCredentials>({ email: '', password: '' });

  protected readonly loginForm = form(this.model, root => validateStandardSchema(root, LoginCredentialsSchema), {
    submission: {
      action: async field => {
        const credentials = field().value();
        console.log('Login submitted:', credentials);
      }
    }
  });
}
