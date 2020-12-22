import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

import routes from './routes.mjs';
import db from './models/index.mjs';
import { convertUserIdToHash } from './helper.mjs';

const app = express();

app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use(methodOverride('_method'));

// To truncate excessive lines
app.locals.truncateDescription = function (description) {
  let truncatedDescription = `${description.substring(0, 100)}`;
  if (truncatedDescription.length > 96) {
    truncatedDescription += '...';
  }
  return truncatedDescription;
};

// Middleware that checks if a user has been logged in and authenticates
// before granting access to a page for every request
app.use((req, res, next) => {
  // set the default value
  req.middlewareLoggedIn = false;

  // check to see if user is logged in but yet to be authenticated
  if (req.cookies.loggedInUserId) {
    // get the hashed value that should be inside the cookie
    const hash = convertUserIdToHash(req.cookies.loggedInUserId);
    // Test the value of the cookie
    if (req.cookies.loggedInHash === hash) {
      req.middlewareLoggedIn = true;
      // Look for this user in the database
      const { loggedInUserId } = req.cookies;
      // Try to get the user
      (async () => {
        try {
          const selectedUser = await db.User.findOne({
            where: {
              id: loggedInUserId,
            },
            // raw: true returns only the dataValues
            raw: true,
          }, {
            returning: true,
          });
          // set the user as a key in the req object so that it is accessible
          req.loggedInUserId = selectedUser.id;
          req.loggedInUser = selectedUser.username;
          req.loggedInUserProfilePic = selectedUser.profile_pic;
          next();
        } catch (error) {
          res.status(503).send('sorry an error occurred');
        }
      })();
      // make sure we don't get down to the next () below
      return;
    }
  }
  next();
});

// set the routes
routes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT);
