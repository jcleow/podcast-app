import express from 'express';
import cookieParser from 'cookie-parser';
import methodOverride from 'method-override';

import routes from './routes.mjs';

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

// set the routes
routes(app);

const PORT = process.env.PORT || 3000;

app.listen(PORT);
