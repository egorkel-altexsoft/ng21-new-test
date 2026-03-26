import { httpResource } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { MovieSearchResultSchema, type MovieSearchResult } from './movie';
import { resourceWithValue } from './utils';

const OMDB_API_KEY = 'YOUR_API_KEY';
const OMDB_API_URL = 'https://www.omdbapi.com/';

@Injectable({
  providedIn: 'root'
})
export class Movies {
  readonly query = signal('');

  readonly moviesResource = resourceWithValue(
    httpResource(
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
    ),
    {
      Search: [],
      totalResults: '0',
      Response: 'False'
    } as const satisfies MovieSearchResult
  );
}
