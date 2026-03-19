import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BigNumber } from 'bignumber.js';
import { User, userSchema } from './user-schema';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly user = signal<User>(
    userSchema.parse({
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 20
    })
  );

  readonly #bigNumber = signal(new BigNumber(100));

  protected readonly bigNumber = computed(() => this.#bigNumber().plus(1).toNumber());
}
