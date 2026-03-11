import * as z from 'zod';

export const userSchema = z.object({
  name: z.string().min(1).trim(),
  email: z.email(),
  age: z.number().min(18).max(100),
});

export type User = z.infer<typeof userSchema>;
