import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prismadb } from "./prismaClient";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:3005/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await prismadb.user.findFirst({
          where: { email: profile.emails![0].value },
        });

        if (!user) {
          user = await prismadb.user.create({
            data: {
              email: profile.emails![0].value,
              name: profile.displayName,
              googleId: profile.id,
            },
          });
        }

        return done(null, user); // Передаємо лише user без token
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

// Сесія користувача
passport.serializeUser((user: any, done) => {
  done(null, user.id); // Передаємо лише ID користувача
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prismadb.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
