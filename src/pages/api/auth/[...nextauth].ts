import { query as q } from "faunadb";

import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";

import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user'
        }
      }
    }),
  ],
  callbacks: {
    async session({ session }) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection(
              q.Match(
                q.Index('subscriptionByUserRef'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('userByEmail'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscriptionByStatus'),
                "active"
              )
            )
          )
        );
  
        return {
          ...session,
          activeSubscription: userActiveSubscription
        };
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },
    async signIn({ user, account, profile }) {
      const { email } = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('userByEmail'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('userByEmail'),
                q.Casefold(user.email)
              )
            )
          )
        );

        return true;
      } catch {
        return false;
      }
    },
  }
});
