import { Component, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Movies } from './movies';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly #movies = inject(Movies);

  protected readonly query = this.#movies.query;
  protected readonly movies = computed(() =>
    this.#movies.moviesResource.error() ? [] : (this.#movies.moviesResource.value()?.Search ?? [])
  );
  protected readonly isLoading = this.#movies.moviesResource.isLoading;
  protected readonly error = computed(() => this.#movies.moviesResource.error()?.message);

  constructor() {
    this.#setupEffects();
  }

  #setupEffects() {
    const errorEffect = effect(() => {
      const error = this.#movies.moviesResource.error();
      if (error) {
        console.error(error.message);
        errorEffect.destroy();
      }
    });
  }
}
