import { httpResource } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MovieSearchResultSchema } from './movie';

const OMDB_API_KEY = 'YOUR_API_KEY';
const OMDB_API_URL = 'https://www.omdbapi.com/';

@Injectable({
  providedIn: 'root'
})
export class Movies {
  readonly query = signal('');

  readonly moviesResource = httpResource(
    () => {
      const q = this.query();
      if (q.length < 3) {
        return undefined;
      }
      return {
        url: OMDB_API_URL,
        params: { apikey: OMDB_API_KEY, s: q }
      };
    },
    { parse: MovieSearchResultSchema.parse }
  );
}
