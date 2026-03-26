import * as z from 'zod';

export const MovieSchema = z.object({
  Title: z.string(),
  Year: z.string(),
  Poster: z.string(),
  imdbID: z.string().brand<'ImdbId'>()
});

export type Movie = z.infer<typeof MovieSchema>;

export const MovieSearchResultSchema = z.object({
  Search: z.array(MovieSchema),
  totalResults: z.string(),
  Response: z.string()
});

export type MovieSearchResult = z.infer<typeof MovieSearchResultSchema>;

// Tests with branded types
const commonDbSchema = z.object({
  id: z.string().brand<'DbId'>(),
  createdAt: z.date(),
  updatedAt: z.date()
});

const userDbSchema = commonDbSchema.extend({
  name: z.string(),
  email: z.email(),
  id: commonDbSchema.shape.id.brand<'UserId'>()
});
type UserDb = z.infer<typeof userDbSchema>;

const user = userDbSchema.parse({
  id: '123',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'John Doe',
  email: 'john.doe@example.com'
});

function deleteUser(_userId: UserDb['id']) {
  // ...
}

// @ts-expect-error - Simple strings are not allowed
deleteUser('123');

// No error
deleteUser(user.id);
