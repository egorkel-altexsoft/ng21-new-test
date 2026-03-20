import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { App } from './app';
import { MovieSearchResult } from './movie/movie.schema';
import { Movies } from './movies';

describe('App', () => {
  it('should show no movies initially', async () => {
    const { locateInput, locateMovies } = setup();
    await locateInput();
    const movies = await locateMovies();
    await expect.element(movies).toBeEmptyDOMElement();
  });

  it('should not fetch movies if query is less than 3 characters', async () => {
    const { locateInput, locateMovies } = setup();
    const input = await locateInput();
    await input.fill('ab');
    const movies = await locateMovies();
    await expect.element(movies).toBeEmptyDOMElement();
  });

  it('should show loading state', async () => {
    const { httpMock, locateInput, locateMovies, locateLoading } = setup();
    const input = await locateInput();
    await input.fill('abc');
    const loading = await locateLoading();
    await expect.element(loading).toBeVisible();
    const request = httpMock.expectOne('https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=abc');
    request.flush({ Search: [], totalResults: '0', Response: 'True' } as const satisfies MovieSearchResult);
    await expect.element(loading).not.toBeInTheDocument();
    const movies = await locateMovies();
    await expect.element(movies).toBeEmptyDOMElement();
  });

  it('should show error state', async () => {
    const { httpMock, locateInput, locateError } = setup();
    const input = await locateInput();
    await input.fill('abc');
    const request = httpMock.expectOne('https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=abc');
    request.flush(null, { status: 500, statusText: 'Internal Server Error' });
    const error = await locateError();
    await expect.element(error).toHaveTextContent('Internal Server Error');
  });

  it('should show movies', async () => {
    const { httpMock, locateInput, locateMovies } = setup();
    const input = await locateInput();
    await input.fill('star wars');
    const request = httpMock.expectOne('https://www.omdbapi.com/?apikey=YOUR_API_KEY&s=star%20wars');
    request.flush({
      Search: [
        {
          Title: 'Star Wars',
          Year: '1977',
          Poster:
            'https://m.media-amazon.com/images/M/MV5BN2Q5OGZkODktYjkxNy00MzZlLTg5MmEtY2Q1M2YzNzg4ODllXkEyXkFqcGc@._V1_.jpg',
          imdbID: 'tt0076759'
        }
      ],
      totalResults: '1',
      Response: 'True'
    } as const satisfies MovieSearchResult);
    const movies = await locateMovies();
    await expect.element(movies).toBeVisible();
    const movie = movies.getByText('Star Wars (1977)');
    await expect.element(movie).toBeVisible();
  });
});

function setup() {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting(), Movies]
  });
  const httpMock = TestBed.inject(HttpTestingController);
  TestBed.createComponent(App);

  async function locateInput() {
    const input = page.getByRole('searchbox');
    await expect.element(input).toBeVisible();
    return input;
  }

  async function locateMovies() {
    const movies = page.getByRole('list');
    await expect.element(movies).toBeInTheDocument();
    return movies;
  }

  async function locateLoading() {
    const loading = page.getByText('Loading...');
    await expect.element(loading).toBeVisible();
    return loading;
  }

  async function locateError() {
    const error = page.getByTestId('error');
    await expect.element(error).toBeInTheDocument();
    return error;
  }

  return { httpMock, locateInput, locateMovies, locateLoading, locateError };
}
