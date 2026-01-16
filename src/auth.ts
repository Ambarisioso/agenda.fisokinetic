import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ username: z.string(), password: z.string() })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { username, password } = parsedCredentials.data;

                    // Hardcoded credentials for MVP phase - User is aware
                    // In production, these should be env vars
                    const validUser = process.env.ADMIN_USER || 'admin';
                    const validPass = process.env.ADMIN_PASSWORD || 'fisiokinetic2024';

                    if (username === validUser && password === validPass) {
                        return { id: '1', name: 'Administrador' };
                    }
                }
                return null;
            },
        }),
    ],
});
