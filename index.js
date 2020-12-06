import pg from 'pg';
import jsSHA from 'jssha';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import express, { response } from 'express';
import multer from 'multer';

// Define upload multer
const upload = multer({ dest: 'uploads/' });

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

// To truncate excessive lines (to be included)

// Middleware to allow static images/css files to be served
app.use(express.static('public'));
// Middleware to allow static images/css files to be served
app.use(express.static('uploads'));
// Middleware that allows POST methods to be overriden for PUT and DELETE requests
app.use(methodOverride('_method'));
// Middleware that allows request.cookies to be parsed
app.use(cookieParser());

// Getting the uploaded artwork files back into the expressjs app
app.use(express.static('uploads'));

// Function that converts supplied userId into a hash (using a salt)
const convertUserIdToHash = (userId) => {
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  const unhashedCookieString = `${userId}-${SALT}`;
  shaObj.update(unhashedCookieString);
  const hashedCookieString = shaObj.getHash('HEX');
  return hashedCookieString;
};

// Function that hashes a variable
const hashPassword = (reqBodyPassword) => {
  // Perform hashing of password first
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(reqBodyPassword);
  const hash = shaObj.getHash('HEX');
  return hash;
};

// Function that includes loggedInUser from req.body to data obj to be passed into ejs
const assignUserDetails = (hostObject, req) => {
  hostObject.loggedInUser = req.loggedInUser;
  hostObject.loggedInUserId = req.loggedInUserId;
  hostObject.loggedInUserProfilePic = req.loggedInUserProfilePic;
  return hostObject;
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
      pool.query(`SELECT id,username,profile_pic FROM users WHERE id = ${loggedInUserId}`, (error, result) => {
        if (error || result.rows.length < 1) {
          res.status(503).send('sorry an error occurred');
        }
        // set the user as a key in the req object so that it is accessible
        req.loggedInUserId = result.rows[0].id;
        req.loggedInUser = result.rows[0].username;
        req.loggedInUserProfilePic = result.rows[0].profile_pic;
        next();
      });
      // make sure we don't get down to the next () below
      return;
    }
  }
  next();
});

// Route that gets the root page
app.get('/', (req, res) => {
  // Store all data to be rendered in ejs in data var
  let data = {};

  // Check if user is logged in and if so assign user specific details to display
  data = assignUserDetails(data, req);

  // Check if the form is submitted by the genre/subgenre selection or the user has already
  // decided to submit the full form
  const episodeToPlay = req.query.episode_id;

  pool
    .query('SELECT * FROM podcast_series')
    .then((result) => {
      data.series = result.rows;

      // Prepare next query for podcast
      const selectAllPodcastEpisodesQuery = {
        text:
        'SELECT *, podcast_episodes.id AS episode_id,podcast_episodes.name AS name, podcast_series.artwork_filename AS album_artwork, podcast_episodes.artwork_filename AS episode_artwork, podcast_episodes.description AS episode_description FROM podcast_episodes INNER JOIN podcast_series ON podcast_episodes.podcast_series_id = podcast_series.id',
      };
      return pool.query(selectAllPodcastEpisodesQuery);
    })

    .then((result) => {
      // Pass all the data from sql query into result.rows;
      data.episodes = result.rows;
      data.episodeLinkToPlay = episodeToPlay;
    })
    // Specific case to check if user wants to view podcast series
    .then(() => {
    // Check if user wants to view the podcast series description
      if (req.query) {
        if (req.query.series_id) {
          return pool.query(`
          SELECT 
          podcast_episodes.id AS episode_id,
          podcast_episodes.name AS episode_name,
          podcast_episodes.description AS episode_description,
          podcast_episodes.artwork_filename AS episode_artwork,
          podcast_episodes.podcast_ext_url,
          podcast_series.id AS series_id,
          podcast_series.name AS series_name,
          podcast_series.description AS series_description,
          podcast_series.artwork_filename AS series_artwork
          FROM podcast_series 
          INNER JOIN podcast_episodes 
          ON podcast_series.id=podcast_episodes.podcast_series_id 
          WHERE podcast_series.id = ${req.query.series_id}`);
        }
      }
    })
    .then((result) => {
      if (result) {
        data.selectedSeries = result.rows;
      }
    })
    .then(() => {
      // Pass all the data into result.rows;
      res.render('mainpage/main', data);
    })
    .catch((error) => console.log(error));
});

// **************************** Left Nav Link Routes **************************** /

// Route that renders a new form to enter podcast_series details
app.get('/podcast/create', (req, res) => {
  if (req.middlewareLoggedIn === false) {
    res.render('errors/displayNotAuthorized');
    return;
  }
  // first, store all the variables inside a data var
  let data = {};

  // Next check if there are data stored in cookies
  // If yes, pass them in to data var to be rendered via ejs
  if (req.cookies.previousValues) {
    data.previousValues = req.cookies.previousValues;
    if (req.cookies.previousFileSelected) {
      data.previousFileSelected = req.cookies.previousFileSelected;
    }
  }

  pool
    .query('SELECT id,name FROM genres')
    // second, check from cookies if there are any genres/subGenres names selected
    .then((result) => { data.genreNames = result.rows.map((row) => row.name);
    // third query for all the genres and subgenres and store into a temp data var
    })
    // fourth query to check if the podcastSeriesName already exists
    .then(() => {
      if (data.previousValues) {
        return pool.query(`SELECT name FROM podcast_series WHERE name='${data.previousValues.podcastSeriesName}'`);
      }
    })
    .then((result) => {
      if (result) {
        if (result.rows.length > 0) {
          data.isNameValid = 'false';
        } if (result.rows.length === 0) {
          data.isNameValid = 'true';
        }
      }
    })
    .then(() => {
      if (req.cookies.previousValues) {
        if (req.cookies.previousValues.genreName) {
          return pool.query(`SELECT subgenres.name FROM subgenres INNER JOIN genres ON genres.id = genre_id WHERE genres.name ='${req.cookies.previousValues.genreName}'`);
        } if (req.cookies.previousValues.genreText) {
          return pool.query(`SELECT subgenres.name FROM subgenres INNER JOIN genres ON genres.id = genre_id WHERE genres.name ='${req.cookies.previousValues.genreText}'`);
        }
      }
    })
    .then((result) => {
      if (result) {
        data.subgenreNames = result.rows.map((row) => row.name);
      }
      // Assign loggedinUser(name) and id to data obj
      data = assignUserDetails(data, req);
      res.render('navlinks/createPodcastSeries', data);
    })
    .catch((error) => console.log(error));
});

// Route that creates a new podcast_series entry
app.post('/podcast/create', upload.single('artwork'), (req, res) => {
  // Check if entry is finished through temp data in req.cookies
  // if entry is not finished, the info will be stored in the cookies
  if (!req.body.submitOverallForm) {
    res.cookie('previousValues', req.body);
    res.cookie('previousFileSelected', req.file);
    res.redirect('/podcast/create');
    return;
  }

  // Insert new podcast details into podcast_series body
  const { podcastSeriesName, description } = req.body;
  const insertNewPodcastDetailsQuery = {
    text: 'INSERT INTO podcast_series(name,description) VALUES ($1,$2) RETURNING id AS podcast_series_id',
    values: [podcastSeriesName, description],
  };
  // Store current podcast_series_id
  let currPodcastSeriesId;

  // Execute all queries
  pool
    .query(insertNewPodcastDetailsQuery)
    .then((result) => {
      currPodcastSeriesId = result.rows[0].podcast_series_id;
      // Insert relationship between podcast and subgenre into podcast_series_subgenres join table
      const insertPodcastSubgenreQuery = {
        text: `INSERT INTO podcast_series_subgenres(podcast_series_id,subgenre_id) SELECT ${currPodcastSeriesId},subgenres.id FROM subgenres WHERE subgenres.name = '${req.body.subgenreText}'`,
      };

      return pool.query(insertPodcastSubgenreQuery);
    })
    // If user uploaded an artwork, then run the query to insert it
    .then(() => {
      if (req.file) {
        const { filename } = req.file;
        const insertPodcastSeriesArtworkQuery = {
          text: `UPDATE podcast_series SET artwork_filename= $1 WHERE id=${currPodcastSeriesId} RETURNING *`,
          values: [filename],
        };

        return pool.query(insertPodcastSeriesArtworkQuery);
      }
    })
    .then(() => {
      // If not, terminate the req-res cycle and clear cookies relating to create podcast form
      res.clearCookie('previousValues');
      res.clearCookie('previousFileSelected');
      res.redirect('/');
    })
    .catch((error) => response.status(503).send(error));
});

// Route that renders a form that creates a new podcast_episode
app.get('/podcast/episode/upload', (req, res) => {
  if (req.middlewareLoggedIn === false) {
    res.render('errors/displayNotAuthorized');
    return;
  }

  // Store all results into a temp object to pass into ejs
  let data = {};
  // Assign loggedinUser(name) and id to data obj
  data = assignUserDetails(data, req);

  if (req.cookies.previousValues) {
    data.previousValues = req.cookies.previousValues;
  }

  const selectAllExistingPodcastsQuery = {
    text: 'SELECT name FROM podcast_series',
  };

  pool
    // first obtain all the names of existing podcasts in the database
    .query(selectAllExistingPodcastsQuery)
    // consolidate the names into an array and assign to var data
    .then((result) => {
      const allExistingSeries = result.rows.map((row) => row.name);
      data.allExistingSeries = allExistingSeries;

      res.render('navlinks/uploadEpisode', data);
    })
    .catch((error) => console.log(error));
});

// Route that submits a request that creates a new podcast_episode entry
app.post('/podcast/episode/upload', upload.single('artwork'), (req, res) => {
  // Check if entry is finished through temp data in req.cookies
  // if entry is not finished, the info will be stored in the cookies
  if (!req.body.submitOverallForm) {
    res.cookie('previousValues', req.body);
    res.redirect('/podcast/episode/upload');
    return;
  }
  // Track the podcastEpisodeId being inserted
  let currPodcastEpisodeId;
  // Get the iframes soundCloudUrl out first
  const { soundCloudUrl: rawIframeUrl } = req.body;

  // searching for the first string that starts with https and ends with true
  // \b stands for word boundary
  // .+? (one or more of any characters except linefeeds, non-greedily)
  const regex = new RegExp(/\bhttps.+?show_teaser=true\b/);
  const refinedUrl = rawIframeUrl.match(regex)[0];

  // Assign refinedurl to the request body
  req.body.soundCloudUrl = refinedUrl;

  // Store all the entries from req.body into values array
  const valuesArray = Object.entries(req.body).map(([key, value]) => value);
  const [podcastSeriesName, podcastEpisodeName, episodeNumber, description, externalLink, artwork] = valuesArray;

  const insertEpisodeQuery = {
    text: 'INSERT INTO podcast_episodes(name,episode_number,description,podcast_ext_url) VALUES($1,$2,$3,$4) RETURNING id',
    values: [podcastEpisodeName, Number(episodeNumber), description, externalLink],
  };

  // Execute all the queries
  pool
  // first insert the generic details of the new episodes
    .query(insertEpisodeQuery)
    .then((result) => {
      currPodcastEpisodeId = result.rows[0].id;
    })
    // next insert the filename of the uploaded artwork
    .then(() => {
      if (req.file) {
        const { filename } = req.file;
        const insertEpisodeArtworkQuery = {
          text: `UPDATE podcast_episodes SET artwork_filename = $1 WHERE id = ${currPodcastEpisodeId}`,
          values: [filename],
        };
        return pool.query(insertEpisodeArtworkQuery);
      }
    })
    // next select/get the serial id of the podcast series
    .then(() => {
      const selectPodcastSeriesId = `SELECT id FROM podcast_series WHERE name= '${podcastSeriesName}'`;
      return pool.query(selectPodcastSeriesId);
    })
    // next insert the podcast_series_id (Foreign key)
    .then((result) => {
      const insertPodcastSeriesIdForeignKeyQuery = (`UPDATE podcast_episodes SET podcast_series_id=${result.rows[0].id} WHERE podcast_episodes.id = ${currPodcastEpisodeId}`);
      return pool.query(insertPodcastSeriesIdForeignKeyQuery);
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => { console.log(error); });
});

// **************************** Render Podcast series/episode Routes **************************** /

// Route that displays the podcast series with its description and episodes
app.get('/series/:id', (req, res) => {
  const { id: seriesId } = req.params;

  // Store all data to be rendered in ejs in data var
  const data = {};
  // Check if user wants to view the podcast series description
  pool.query(`
  SELECT 
  podcast_episodes.id AS episode_id,
  podcast_episodes.name AS episode_name,
  podcast_episodes.description AS episode_description,
  podcast_episodes.artwork_filename AS episode_artwork,
  podcast_episodes.podcast_ext_url,
  podcast_series.id AS series_id,
  podcast_series.name AS series_name,
  podcast_series.description AS series_description,
  podcast_series.artwork_filename AS series_artwork
  FROM podcast_series 
  INNER JOIN podcast_episodes 
  ON podcast_series.id=podcast_episodes.podcast_series_id 
  WHERE podcast_series.id = ${seriesId}`)
    .then((result) => {
      if (result) {
        data.selectedSeries = result.rows;
        if (req.query) {
          const { episodeLinkToPlay } = req.query;
          data.episodeLinkToPlay = episodeLinkToPlay;
        }
      }
    })
    .then(() => {
    // Pass all the data into result.rows;

      res.render('selectedSeries', data);
    })
    .catch((error) => console.log(error));
});

// Route that displays an individual podcast episode with its comments
app.get('/podcast/episode/:id', (req, res) => {
  const currEpisodeId = req.params.id;
  // Store data to be rendered into ejs into a var
  let data = {};

  // Assign current username and id to data var if logged in
  data = assignUserDetails(data, req);

  // Query for specific podcast episode details
  pool
    .query(`SELECT * FROM podcast_episodes WHERE id=${Number(currEpisodeId)}`)
    .then((result) => {
      data.selectedEpisode = result.rows[0];

      // If user chooses to play the episode on the page, then a req.query will exist
      if (req.query) {
        data.episodeLinkToPlay = req.query.podcast_ext_url;
      }

      // Prepare and perform selection of all existing comments relating to this episode
      return pool.query(
        `SELECT *,
      user_episode_comments.id AS user_episode_comment_id,
      users.id AS user_id
      FROM user_episode_comments 
      INNER JOIN users 
      ON poster_id = users.id 
      WHERE podcast_episode_id=${currEpisodeId} ORDER BY user_episode_comments.id DESC`,
      );
    })
    .then((result) => {
      data.comments = result.rows;
      if (req.middlewareLoggedIn === true) {
        // Query for current user whether he/she has favourited this episode before
        return pool.query(
          `SELECT favourited
           FROM listener_podcast_episodes
           WHERE listener_id=${req.loggedInUserId}
           AND podcast_episode_id = ${currEpisodeId}`,
        );
      }
    })
    .then((result) => {
      // Check if episode was favourited was queried (i.e only when user is logged in)
      if (result && result.rows.length > 0) {
        data.isEpisodeFavourited = result.rows[0].favourited;
      }
      // Query for current user which comments he favourited before
      return pool.query(`
      SELECT user_episode_comments.id,favourited
      FROM favourite_comments
      INNER JOIN user_episode_comments
      ON user_episode_comments.id=user_episode_comment_id
      WHERE favourite_comments.user_id = ${req.loggedInUserId}
      `);
    })
    .then((result) => {
      if (result && result.rows.length > 0) {
        result.rows.forEach((row) => {
          data.comments.forEach((comment) => {
            if (comment.user_episode_comment_id === row.id && row.favourited === true) {
              comment.isFavourited = true;
            }
          });
        });
      }
      res.render('episodeDisplay', data);
    });
});

// **************************** User Login & Registration **************************** /
// Route that renders the login page
app.get('/login', (req, res) => {
  res.render('navlinks/login');
});

// Route that submits a new login request
app.post('/login', (req, res) => {
  // Convert req.body.password to hashed password first
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  shaObj.update(req.body.password);
  const hash = shaObj.getHash('HEX');
  pool
    .query(`SELECT id from users WHERE username='${req.body.username}' AND password='${hash}'`)
    .then((result) => {
      if (result.rows.length === 0) {
        res.render('error/displayErrorPage');
        return;
      }
      // Perform hashing of userId using username + salt
      // and send out hashString in cookie

      const hashedUserIdString = convertUserIdToHash(result.rows[0].id);
      res.cookie('loggedInHash', hashedUserIdString);
      res.cookie('loggedInUserId', result.rows[0].id);
      res.redirect('/');
    });
});

// Route that renders the register page
app.get('/register', (req, res) => {
  res.render('navlinks/register');
});

// Route that submits a new user registration
app.post('/register', upload.single('profilePic'), (req, res) => {
  const hash = hashPassword(req.body.password);
  req.body.password = hash;
  // Reassign profile_pic to the hashed filename by multer in req.body
  // if a profile picture was uploaded
  if (req.file) {
    req.body.profilePic = req.file.filename;
  }
  const userValues = Object.entries(req.body).map(([key, value]) => value);
  const checkIfUsernameAndEmailExistsQuery = {
    text: `SELECT username,email_address FROM users WHERE (username ='${req.body.username}') OR (email_address='${req.body.emailAddress}')`,
  };

  const createNewUserQuery = {
    text: 'INSERT INTO users(first_name,last_name,email_address,username,password,profile_pic) VALUES($1,$2,$3,$4,$5,$6) RETURNING * ',
    values: userValues,
  };

  pool
    .query(checkIfUsernameAndEmailExistsQuery)
    .then((result) => {
      // Consolidate and filter the existing usernames from query into an array
      const arrayOfExistingUsernames = result.rows.filter((row) => row.username === req.body.username);

      // Consolidate and filter the existing usernames from query into an array
      const arrayOfExistingEmailAddresses = result.rows.filter((row) => row.email_address === req.body.emailAddress);

      // Test whether username and email addresses already exists by their array lengths
      if (arrayOfExistingUsernames.length === 0 && arrayOfExistingEmailAddresses.length === 0) {
        return Promise.resolve('true');
      }
      if (arrayOfExistingUsernames.length > 0 && arrayOfExistingEmailAddresses.length > 0) {
        return Promise.reject('Email & Username already exists.');
      }

      if (arrayOfExistingUsernames.length > 0) {
        return Promise.reject('Username already exists.');
      }

      if (arrayOfExistingEmailAddresses.length > 0) {
        return Promise.reject('Email already exists.');
      }
    })
    .then((isFormValid) => {
      if (isFormValid === 'true') {
        return pool.query(createNewUserQuery);
      }
    })
    .then((result) => {
      // If form is valid an an create new user query was performed
      if (result) {
        if (result.rows.length > 0) {
          const hashedUserIdString = convertUserIdToHash(result.rows[0].id);
          res.cookie('loggedInHash', hashedUserIdString);
          res.cookie('loggedInUserId', result.rows[0].id);
          res.clearCookie('previousValues');
          res.redirect('/');
        }
      }
    })
    .catch((error) => {
      // Else form was invalid and a new user creation query was not performed
      const data = {};
      // Set both username and email to valid by default
      data.isUsernameValid = 'true';
      data.isEmailValid = 'true';
      data.previousValues = req.body;
      // Perform validation checking for email and username
      if (error === 'Email & Username already exists.') {
        data.isEmailValid = 'false';
        data.isUsernameValid = 'false';
      } else if (error === 'Email already exists.') {
        data.isEmailValid = 'false';
      } else if (error === 'Username already exists.') {
        data.isUsernameValid = 'false';
      }
      console.log(error, 'error');
      res.render('navlinks/register', data);
    });
});

// Route that gets a user's profile page
app.get('/user/:id', (req, res) => {
  // Store all data to be rendered in ejs in data var
  let data = {};
  // Assign current username and id to data var if logged in
  data = assignUserDetails(data, req);

  // Check if the form is submitted by the genre/subgenre selection or the user has already
  // decided to submit the full form
  const episodeToPlay = req.query.episode_id;

  pool
    .query('SELECT * FROM podcast_series')
    .then((result) => {
      data.series = result.rows;

      // Prepare next query for podcast
      const selectAllPodcastEpisodesQuery = 'SELECT *,podcast_episodes.name AS name, podcast_series.artwork_filename AS album_artwork, podcast_episodes.artwork_filename AS episode_artwork, podcast_episodes.description AS episode_description FROM podcast_episodes INNER JOIN podcast_series ON podcast_episodes.podcast_series_id = podcast_series.id';
      return pool.query(selectAllPodcastEpisodesQuery);
    })

    .then((result) => {
      // Pass all the data from sql query into result.rows;
      data.episodes = result.rows;
      data.episodeLinkToPlay = episodeToPlay;
    })
    // Specific case to check if user wants to view podcast series
    .then(() => {
    // Check if user wants to view the podcast series description
      if (req.query) {
        if (req.query.series_id) {
          return pool.query(`
          SELECT 
          podcast_episodes.id AS episode_id,
          podcast_episodes.name AS episode_name,
          podcast_episodes.description AS episode_description,
          podcast_episodes.artwork_filename AS episode_artwork,
          podcast_episodes.podcast_ext_url,
          podcast_series.id AS series_id,
          podcast_series.name AS series_name,
          podcast_series.description AS series_description,
          podcast_series.artwork_filename AS series_artwork
          FROM podcast_series 
          INNER JOIN podcast_episodes 
          ON podcast_series.id=podcast_episodes.podcast_series_id 
          WHERE podcast_series.id = ${req.query.series_id}`);
        }
      }
    })
    .then((result) => {
      if (result) {
        data.selectedSeries = result.rows;
      }
    })
    .then(() => {
      // Pass all the data into result.rows;
      res.render('navlinks/userProfile', data);
    })
    .catch((error) => console.log(error));
});

// Route that logs out a user
app.delete('/logout', (req, res) => {
  res.clearCookie('loggedInHash');
  res.clearCookie('loggedInUserId');
  res.redirect('/');
});

// **************************** Adding comments to an episode **************************** /
// Route that renders the login page

// Creates a new comment as well as a favourite entry (false by default)
app.post('/podcast/episode/:id/comment', (req, res) => {
  const insertCommentQuery = {
    text: 'INSERT INTO user_episode_comments(comment,podcast_episode_id,poster_id) VALUES ($1,$2,$3) RETURNING id AS curr_episode_comment_id',
    values: [req.body.comment, req.params.id, req.loggedInUserId],
  };

  pool
    .query(insertCommentQuery)
    .then((result) => {
      const currCommentId = result.rows[0].curr_episode_comment_id;
      // Insert a default blank favourite entry into favourite join table as well
      return pool.query(
        `INSERT INTO favourite_comments(favourited,user_episode_comment_id,user_id) 
        VALUES(false,${Number(currCommentId)},${req.loggedInUserId}) RETURNING *`,
      );
    })
    .then(() => {
      res.redirect(`/podcast/episode/${req.params.id}`);
    })
    .catch((error) => {
      console.log(error);
    });
});

// Handles both creation and edit request to favourite or unfavourite a podcast episode
app.post('/podcast/episode/:id/favourite', (req, res) => {
  const currPodcastEpisodeId = req.params.id;
  // First, check the status of whether the episode has been favourited
  pool
    .query(`SELECT favourited FROM listener_podcast_episodes WHERE listener_id = ${req.loggedInUserId} AND podcast_episode_id =${currPodcastEpisodeId}`)
    .then((result) => {
      // if no records of likes from this listener before, insert a new entry
      if (result.rows.length === 0) {
        return pool.query(`INSERT INTO listener_podcast_episodes(favourited,listener_id,podcast_episode_id) VALUES(true,${req.loggedInUserId},${currPodcastEpisodeId})`);
      }
      // Otherwise if a record exists, update it to the opposite
      if (result.rows.length > 0) {
        let newFavouritedStatus;
        if (result.rows[0].favourited === true) {
          newFavouritedStatus = false;
        } else if (result.rows[0].favourited === false) {
          newFavouritedStatus = true;
        }
        return pool.query(`UPDATE listener_podcast_episodes SET favourited=${newFavouritedStatus} WHERE listener_id=${req.loggedInUserId} and podcast_episode_id=${currPodcastEpisodeId}`);
      }
    }).then(() => {
      res.redirect(`/podcast/episode/${currPodcastEpisodeId}`);
    });
});

// Handles the editing of a previously inserted favourite entry (upon creation of a comment)
app.put('/podcast/episode/:id/comment/:commentId/favourite', (req, res) => {
  let newFavouriteStatus;
  pool
    .query(`SELECT favourited FROM favourite_comments 
  WHERE user_id=${req.loggedInUserId}
  AND user_episode_comment_id = ${req.params.commentId}
  `)
    .then((result) => {
      if (result.rows[0].favourited === true) {
        newFavouriteStatus = false;
      } else {
        newFavouriteStatus = true;
      }
    })
    .then(() => pool.query(`UPDATE
  favourite_comments 
  SET favourited = ${newFavouriteStatus}
  WHERE user_episode_comment_id = ${req.params.commentId} 
  AND user_id = ${req.loggedInUserId} RETURNING * `))
    .then((result) => {
      console.log(result);
      res.redirect(`/podcast/episode/${req.params.id}`);
    });
});

// **************************** Adding friends **************************** /
// Route that renders the login page

// **** Displaying user profile page ***/
// Route that gets a user's profile page
app.get('/user/:id', (req, res) => {
  // Store all data to be rendered in ejs in data var
  let data = {};
  // Assign current username and id to data var if logged in
  data = assignUserDetails(data, req);

  // Check if the form is submitted by the genre/subgenre selection or the user has already
  // decided to submit the full form
  const episodeToPlay = req.query.episode_id;

  pool
    .query('SELECT * FROM podcast_series')
    .then((result) => {
      data.series = result.rows;

      // Prepare next query for podcast
      const selectAllPodcastEpisodesQuery = 'SELECT *,podcast_episodes.name AS name, podcast_series.artwork_filename AS album_artwork, podcast_episodes.artwork_filename AS episode_artwork, podcast_episodes.description AS episode_description FROM podcast_episodes INNER JOIN podcast_series ON podcast_episodes.podcast_series_id = podcast_series.id';
      return pool.query(selectAllPodcastEpisodesQuery);
    })

    .then((result) => {
      // Pass all the data from sql query into result.rows;
      data.episodes = result.rows;
      data.episodeLinkToPlay = episodeToPlay;
    })
    // Specific case to check if user wants to view podcast series
    .then(() => {
    // Check if user wants to view the podcast series description
      if (req.query) {
        if (req.query.series_id) {
          return pool.query(`
          SELECT 
          podcast_episodes.id AS episode_id,
          podcast_episodes.name AS episode_name,
          podcast_episodes.description AS episode_description,
          podcast_episodes.artwork_filename AS episode_artwork,
          podcast_episodes.podcast_ext_url,
          podcast_series.id AS series_id,
          podcast_series.name AS series_name,
          podcast_series.description AS series_description,
          podcast_series.artwork_filename AS series_artwork
          FROM podcast_series 
          INNER JOIN podcast_episodes 
          ON podcast_series.id=podcast_episodes.podcast_series_id 
          WHERE podcast_series.id = ${req.query.series_id}`);
        }
      }
    })
    .then((result) => {
      if (result) {
        data.selectedSeries = result.rows;
      }
    })
    .then(() => {
      // Pass all the data into result.rows;
      res.render('navlinks/userProfile', data);
    })
    .catch((error) => console.log(error));
});

// Route that renders user's playlists
app.get('/user/:id/playlists');

// Route that renders user's favourite episodes
app.get('/user/:id/favouriteEpisodes', (req, res) => {
  const { id: currUserId } = req.params;
  let data = {};
  data = assignUserDetails(data, req);
  pool
    .query(
      `SELECT * 
      FROM podcast_episodes
      INNER JOIN listener_podcast_episodes 
      ON listener_podcast_episodes.podcast_episode_id=podcast_episodes.id
      WHERE favourited=true`,
    )
    .then((result) => {
      console.log(result.rows, 'all favourited podcast episodes');
      data.episodes = result.rows;
      if (req.query) {
        data.episodeLinkToPlay = req.query.podcast_ext_url;
      }
      res.render('userProfile/favouriteEpisodes', data);
    })
    .catch((error) => { console.log(error); });
});

// Route that renders all of user's favourited comments
app.get('/user/:id/favouriteComments', (req, res) => {
  const { id: currUserId } = req.params;
  let data = {};
  data = assignUserDetails(data, req);
  data.currUserId = currUserId;
  if (req.query) {
    data.episodeLinkToPlay = req.query.podcast_ext_url;
  }
  // First query from table all the comments that were favourited before
  pool
    .query(
      `SELECT poster_id,favourited,comment
    FROM favourite_comments
    INNER JOIN user_episode_comments
    ON user_episode_comments.id=favourite_comments.user_episode_comment_id
    WHERE favourite_comments.user_id = ${currUserId}
    `,
    )
    // However the join tables does not contain the original poster's username and picture
    // so for each favourited comment, we have to perform a query to get the relevant deets
    .then((result) => {
      let arrayOfPosterQuery;
      if (result.rows.length > 0) {
        // Store all the queries as promises in an array
        arrayOfPosterQuery = result.rows.map((row) => pool
          .query(`SELECT username,profile_pic FROM users WHERE id=${row.poster_id} `)
          .then((posterResult) => {
            row.username = posterResult.rows[0].username;
            row.profile_pic = posterResult.rows[0].profile_pic;
            // return the result later
            return row;
          })
          .catch((error) => console.log(error)));
      }

      return Promise.all(arrayOfPosterQuery);
    })
    // only when all the queries are successfully completed
    // we can obtain all the favourited comments by the user, c/w with the original
    // commenter's username and profile picture
    .then((arrayResult) => {
      console.log(arrayResult, 'arrayResult');
      data.comments = arrayResult;
      res.render('userProfile/favouriteComments', data);
    })
    .catch((error) => { console.log(error); });
});

// Route that renders all of user's friends
app.get('/user/:id/friends', (req, res) => {

});

app.listen(PORT);
