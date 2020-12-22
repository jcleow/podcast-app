import { assignLoggedInUserDetails } from '../helper.mjs';

export default function createSeries(db) {
  const newForm = async (req, res) => {
    // Used to store displayData
    let data = {};

    // In the event user has entered some values before
    if (req.cookies.previousValues) {
      data.previousValues = req.cookies.previousValues;
      console.log(data, 'data');
      if (req.cookies.previousFileSelected) {
        data.previousFileSelected = req.cookies.previousFileSelected;
      }
    }

    // Step-1:First obtain all the genre data to be generated in the dropdown button
    const genresData = await db.Genre.findAll({
      attributes: ['id', ['name', 'genreName']],
    });
    console.log(genresData, 'genresData');
    data.genreNames = genresData.map((genreData) => genreData.dataValues.genreName);

    // Step-2: Perform check to see if series name already exists upon first submission
    if (data.previousValues) {
      console.log(data.previousValues, 'previousValues');
      // Perform search for associated subgenres
      const seriesName = await db.Series.findAll({
        where: {
          name: data.previousValues.podcastSeriesName,
        },
        attributes: ['name'],
      });
      console.log(seriesName, 'seriesName');
      if (seriesName.length.length > 0) {
        data.isNameValid = 'false';
      } else if (seriesName.length === 0) {
        data.isNameValid = 'true';
      }
    }

    // Step-3 Query for subgenres based on genre input in previousValues
    let selectedGenreName;
    if (req.cookies.previousValues) {
      if (req.cookies.previousValues.genreName) {
        selectedGenreName = req.cookies.previousValues.genreName;
      } else if (req.cookies.previousValues.genreText) {
        selectedGenreName = req.cookies.previousValues.genreText;
      }
      // // This is an inner join between genre and subgenre (eager loading)
      // const subgenresData = await db.Subgenre.findAll({
      //   include: {
      //     model: db.Genre,
      //     required: true,
      //     where: {
      //       name: selectedGenreName,
      //     },
      //   },
      // });
      // data.subgenreNames = subgenresData.map((subgenre) => subgenre.name);

      // Getting the subgenres using associative methods (lazy loading)
      const selectedGenre = await db.Genre.findOne({
        where: {
          name: selectedGenreName,
        },
      });
      console.log(selectedGenre, 'selectedGenre');
      const allSubGenres = await selectedGenre.getSubgenres();
      console.log(allSubGenres, 'allSubGenres');
      data.subgenreNames = allSubGenres.map((subgenre) => subgenre.name);
    }

    // Step-4 Assign logged-in userdetails
    data = assignLoggedInUserDetails(data, req);
    console.log(data.subgenreNames, 'subgenreNames');
    res.render('series/newSeriesForm', data);
  };

  const create = async (req, res) => {
    // Check if entry is finished through temp data in req.cookies
    // if entry is not finished, the info will be stored in the cookies
    if (!req.body.submitOverallForm) {
      res.cookie('previousValues', req.body);
      res.cookie('previousFileSelected', req.file);
      // Redirect back to series creation
      res.redirect('/series/new');
      return;
    }
    console.log('createSeriesTest');
    // Used to store displayData
    const data = {};

    // Insert new podcast details into podcast_series table
    const { podcastSeriesName, description: podcastDescription } = req.body;

    const selectedSeries = await db.Series.create({
      name: podcastSeriesName,
      description: podcastDescription,
    });

    // If user uploaded a file
    if (req.file) {
      selectedSeries.artwork_filename = req.file.location;
      await selectedSeries.save();
    }

    selectedSeries.setSubgenres();

    // Final Step:
    // If not, terminate the req-res cycle and clear cookies relating to create podcast form
    res.clearCookie('previousValues');
    res.clearCookie('previousFileSelected');
    res.redirect('/');
  };

  const index = async (req, res) => {
    const selectedSeries = await db.Series.findOne({
      where: {
        id: req.params.id,
      },
      include: db.Episode,
    });
    console.log(selectedSeries, 'selectedSeries');
    // passing in selectedSeries as an instance of the Series
    // such that it can access the attribute directly such as selectedSeries.id
    res.render('series/selectedSeries', { selectedSeries });
  };
  return { newForm, create, index };
}
