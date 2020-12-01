import pg from 'pg';
import jsSHA from 'jssha';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import express from 'express';

// Constant Variable of process.env
const SALT = process.env.MY_ENV_VAR;
// Set up Pooling with PostgresQL
const { Pool } = pg;
let poolConfig;
if (process.env.ENV === 'PRODUCTION') {
  poolConfig = {
    user: 'postgres',
    // set DB_PASSWORD as an environment variable for security.
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'podcast',
    port: 5432,
  };
} else {
  poolConfig = {
    user: process.env.USER,
    host: 'localhost',
    database: 'podcast',
    port: 5432, // Postgres server always runs on this port
  };
}
// Create a new instance of Pool object
const pool = new Pool(poolConfig);

// Set up Express app;
const app = express();
const PORT = process.argv[2];
// Set view engine to ejs
app.set('view engine', 'ejs');
// To parse encoded incoming requests  with urlencoded payloads
app.use(express.urlencoded({ extended: false }));
// Middleware to allow static images/css files to be served
app.use(express.static('public'));
// Middleware that allows POST methods to be overriden for PUT and DELETE requests
app.use(methodOverride('_method'));
// Middleware that allows request.cookies to be parsed
app.use(cookieParser());

// Function that converts supplied username into a hash (using a salt)
const convertUserIdToHash = (userId) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhashedCookieString = `${userId}-${SALT}`;
  shaObj.update(unhashedCookieString);
  const hashedCookieString = shaObj.getHash('HEX');
  return hashedCookieString;
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
      pool.query(`SELECT id,username FROM users WHERE id = ${loggedInUserId}`, (error, result) => {
        if (error || result.rows.length < 1) {
          res.status(503).send('sorry an error occurred');
        }
        // set the user as a key in the req object so that it is accessible
        req.loggedInUserId = result.rows[0].id;
        req.loggedInUser = result.rows[0].username;
        next();
      });
      // make sure we don't get down to the next () below
      return;
    }
  }
  next();
});
app.get('/', (req, res) => {
  const episodeToPlay = req.query.episode_id;
  const selectAllPodcastQuery = {
    text: 'SELECT * FROM podcast_episode',
  };
  pool
    .query(selectAllPodcastQuery)
    .then((result) => {
      const data = {};
      // Pass all the data from sql query into result.rows;
      data.episodes = result.rows;
      data.episodeLinkToPlay = episodeToPlay;
      // Pass all the data into result.rows;
      console.log(data, 'data');
      res.render('mainpage/main', data);
    })
    .catch((error) => console.log(error));
});

app.get('/podcast/create', (req, res) => {
  res.render('navlinks/createPodcastSeries');
});

app.get('/podcast/episode/create', (req, res) => {
  res.render('navlinks/uploadEpisode');
});

app.post('/podcast/episode/create', (req, res) => {
  const { soundCloudUrl: rawIframeUrl } = req.body;
  console.log(req.body, 'req.body');

  // searching for the first string that starts with https and ends with true
  // \b stands for word boundary
  // .+? (one or more of any characters except linefeeds, non-greedily)
  const regex = new RegExp(/\bhttps.+?show_teaser=true\b/);
  const refinedUrl = rawIframeUrl.match(regex)[0];
  req.body.soundCloudUrl = refinedUrl;
  const valuesArray = Object.entries(req.body).map(([key, value]) => value);
  const insertEpisodeQuery = {
    text: 'INSERT INTO podcast_episode(name,episode_number,description,podcast_ext_url) VALUES($1,$2,$3,$4)',
    values: valuesArray,
  };
  pool
    .query(insertEpisodeQuery)
    .then((result) => {
      console.log(result);
      res.redirect('/'); });
});

app.listen(PORT);
