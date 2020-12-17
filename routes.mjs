import db from './models/index.mjs';
import mainpage from './controllers/mainpage.mjs';

export default function routes(app) {
  const mainPageController = mainpage(db);
  app.get('/', mainPageController.index);

  // const seriesPageController = series(db);
  // app.get('/', seriesController.index);
}
