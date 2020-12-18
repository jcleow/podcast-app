import { assignLoggedInUserDetails } from '../helper.mjs';

export default function newSeriesForm(db) {
  const index = async (req, res) => {
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
      // This is an inner join between genre and subgenre
      const subgenresData = await db.Subgenre.findAll({
        include: {
          model: db.Genre,
          required: true,
          where: {
            name: selectedGenreName,
          },
        },
      });
      data.subgenreNames = subgenresData.map((subgenre) => subgenre.name);
    }

    // Step-4 Assign logged-in userdetails
    data = assignLoggedInUserDetails(data, req);
    console.log(data.subgenreNames, 'subgenreNames');
    res.render('series/newSeriesForm', data);
  };
  return { index };
}
