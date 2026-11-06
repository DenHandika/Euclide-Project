import { getServerSession, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getPool } from './db';
import { activeUserByEmail, activeUserById, ServerUser, permit } from './users';
import { ApiError } from './errors';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  providers: [GoogleProvider({clientId:process.env.GOOGLE_CLIENT_ID ?? '',clientSecret:process.env.GOOGLE_CLIENT_SECRET ?? ''})],
  callbacks: {
    async signIn({user,account,profile}) {
      if (account?.provider !== 'google' || !profile || !('email_verified' in profile) || profile.email_verified !== true || !user.email) return false;
      const registered = await activeUserByEmail(getPool(),user.email);
      if (!registered) return false;
      user.id = registered.id;
      return true;
    },
    async jwt({token,user}) {
      if (user) token.euclideUserId = user.id;
      return token;
    },
    async session({session,token}) {
      if (session.user) (session.user as typeof session.user & {id?:string}).id = typeof token.euclideUserId === 'string' ? token.euclideUserId : undefined;
      return session;
    },
  },
};
export async function requireUser(roles?: ServerUser['role'][]): Promise<ServerUser> {
  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.includes('CHANGE_ME')) throw new ApiError(503,'auth_unconfigured','Autentikasi belum dikonfigurasi.');
  const session = await getServerSession(authOptions);
  const id = (session?.user as {id?:string} | undefined)?.id;
  if (!id) throw new ApiError(401,'unauthenticated','Silakan masuk terlebih dahulu.');
  // Re-read status and permissions so deactivation/reassignment takes effect immediately.
  const user = await activeUserById(getPool(),id);
  if (!user) throw new ApiError(403,'inactive','Akun tidak aktif.');
  if (roles) permit(user,roles);
  return user;
}
