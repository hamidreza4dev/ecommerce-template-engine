import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';

passport.use(
  new Strategy({ usernameField: 'email' }, async function (
    email,
    password,
    done
  ) {
    const user = await User.findOne({ email });

    if (!user) {
      return done(null, false, {
        message: 'there is no user with this email .',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return done(null, user);
    } else {
      return done(null, false, {
        message: 'username or password is invalid .',
      });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
