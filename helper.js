import jsSHA from 'jssha';
import pg from 'pg';

// Salt for further encryption
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
    database: 'podcastTest',
    port: 5432, // Postgres server always runs on this port
  };
}

// Create a new instance of Pool object
const pool = new Pool(poolConfig);

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
// hostobject is usually referred to as 'data' variable
const assignLoggedInUserDetails = (hostObject, req) => {
  hostObject.loggedInUser = req.loggedInUser;
  hostObject.loggedInUserId = req.loggedInUserId;
  hostObject.loggedInUserProfilePic = req.loggedInUserProfilePic;
  return hostObject;
};

// Function that assigns current username,profile pic and id
// to data var to render in ejs in a supplied 'hostObj' using the query 'result'
// to be used in tandem with select query for curr user details
const assignCurrentProfilePageUserInfo = (hostObj, currUserDetailResult, req) => {
  hostObj.currUsername = currUserDetailResult.rows[0].curr_username;
  hostObj.currUserProfilePic = currUserDetailResult.rows[0].profile_pic;
  hostObj.currUserId = Number(req.params.id);
  if (req.query) {
    hostObj.episodeLinkToPlay = req.query.podcast_ext_url;
  }
  return hostObj;
};

// Authentication function that checks if currUser is the creator for series
const checkIsUserCreatorAuth = (req, res, next) => {
  // Check if user is authenticated
  if (req.cookies.loggedInHash !== convertUserIdToHash(req.loggedInUserId)) {
    console.log('test-1');
    res.render('errors/displayNotAuthorized');
    return;
  }
  // Assign seriesId based on parameters used in url
  let seriesId;
  let checkIfCreatorQuery;
  if (req.params.seriesId) {
    // means user is at an episodes page
    checkIfCreatorQuery = `
    SELECT creator_id 
    FROM creator_podcast_series
    INNER JOIN podcast_series
    ON  podcast_series.id = creator_podcast_series.podcast_series_id
    INNER JOIN podcast_episodes
    ON podcast_episodes.podcast_series_id = podcast_series.id
    WHERE creator_id= ${req.loggedInUserId} 
    AND podcast_episodes.podcast_series_id = ${req.params.seriesId}
    AND podcast_episodes.id = ${req.params.id}
    `;
  } else {
    // means user is at an series page
    checkIfCreatorQuery = `
    SELECT creator_id 
    FROM creator_podcast_series
    WHERE creator_id= ${req.loggedInUserId} 
    AND podcast_series_id = ${req.params.id}`;
  }

  pool
  // Query whether the loggedInUser is the same as the site that he is trying to access
    .query(checkIfCreatorQuery)
    .then((isCreatorResult) => {
      if (isCreatorResult.rows.length === 0) {
        res.render('errors/displayNotAuthorized');
      }
    });
  next();
};

export {
  pool,
  convertUserIdToHash, hashPassword,
  assignLoggedInUserDetails, assignCurrentProfilePageUserInfo,
  checkIsUserCreatorAuth,
};
