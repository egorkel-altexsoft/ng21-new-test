import { z } from 'zod';

export const MovieSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  Poster: z.string(),
  imdbID: z.string(),
});

export type Movie = z.infer<typeof MovieSchema>;

export const MovieSearchResultSchema = z.object({
  Search: z.array(MovieSchema),
  totalResults: z.string(),
  Response: z.string(),
});

export type MovieSearchResult = z.infer<typeof MovieSearchResultSchema>;
