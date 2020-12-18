export default function createSeries(db) {
  const index = async (req, res) => {
    console.log('test2333');
    console.log(req.body, 'req-body');
    // Check if entry is finished through temp data in req.cookies
    // if entry is not finished, the info will be stored in the cookies
    if (!req.body.submitOverallForm) {
      res.cookie('previousValues', req.body);

      res.cookie('previousFileSelected', req.file);
      res.redirect('/series/new');
    }
    // // Used to store displayData
    // const data = {};

    // res.render('series/newSeriesForm', data);
  };
  return { index };
}
