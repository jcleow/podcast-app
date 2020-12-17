export default function mainpage(db) {
  const index = async (req, res) => {
    try {
      // Clean and pass an array of the data into a new variable to be rendered in ejs
      const displayData = {};

      // find all series data
      const seriesData = await db.Series.findAll({
        attributes: ['id', 'name', 'description', 'artwork_filename'],
      });

      // find all episodes data
      const episodesData = await db.Episode.findAll({
        attributes: ['id', 'name', 'description', ['artwork_filename', 'episode_artwork'], 'podcast_ext_url'],
      });

      // Store all related values into displayData
      displayData.series = seriesData.map((seriesData) => seriesData.dataValues);
      displayData.episodes = episodesData.map((episodeData) => episodeData.dataValues);

      // if user chooses to play an episode... store the link inside displayData
      if (req.query) {
        displayData.episodeLinkToPlay = req.query.episode_id;
      }

      // finally, render the series
      res.render('series/main', displayData);
    } catch (error) {
      console.log(error);
    }
  };
  return { index };
}
