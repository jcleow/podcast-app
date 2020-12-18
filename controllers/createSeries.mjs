export default function createSeries(db) {
  const index = async (req, res) => {
    // Check if entry is finished through temp data in req.cookies
    // if entry is not finished, the info will be stored in the cookies
    if (!req.body.submitOverallForm) {
      res.cookie('previousValues', req.body);
      res.cookie('previousFileSelected', req.file);
      // Redirect back to series creation
      res.redirect('/series/new');
    }
    // Used to store displayData
    const data = {};

    // Insert new podcast details into podcast_series table
    const { podcastSeriesName, description } = req.body;

    db.Series.create({

    });

    //   // Final Step:
    //   // If not, terminate the req-res cycle and clear cookies relating to create podcast form
    //   res.clearCookie('previousValues');
    //   res.clearCookie('previousFileSelected');
    //   res.redirect('/');
    // };
  };
  return { index };
}
