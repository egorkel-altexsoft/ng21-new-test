import * as z from 'zod';

export const LoginCredentialsSchema = z.strictObject({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(12, 'Password must be at least 12 characters')
});

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
