import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import db from './models/index.mjs';
import mainpage from './controllers/mainpage.mjs';
import series from './controllers/series.mjs';
import login from './controllers/logins.mjs';
import users from './controllers/users.mjs';

// Configuring S3
const s3 = new aws.S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: 'ap-southeast-1',
});
// Configuring the Multer-S3 upload
const multerUpload = multer({
  storage: multerS3({
    s3,
    bucket: 'podcast-app-artwork',
    acl: 'public-read',
    metadata: (request, file, callback) => {
      callback(null, { fieldName: file.fieldname });
    },
    key: (request, file, callback) => {
      callback(null, Date.now().toString());
    },
  }),
});

export default function routes(app) {
  const mainPageController = mainpage(db);
  app.get('/', mainPageController.index);

  const SeriesController = series(db);
  app.get('/series/:id', SeriesController.index);
  app.get('/series/new', SeriesController.newForm);
  app.post('/series', multerUpload.single('artwork'), SeriesController.create);

  const LoginController = login(db);
  app.get('/login', LoginController.newForm);
  app.post('/login', LoginController.create);

  const UsersController = users(db);
  app.get('/register', UsersController.newForm);
  app.post('/register', multerUpload.single('profilePic'), UsersController.create);
}
