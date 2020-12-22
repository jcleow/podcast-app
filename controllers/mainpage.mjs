import { assignLoggedInUserDetails } from '../helper.mjs';

export default function mainpage(db) {
  const index = async (req, res) => {
    try {
      // Clean and pass an array of the data into a temp 'data' variable to be rendered in ejs
      let data = {};

      // find all series data
      const seriesData = await db.Series.findAll({
        attributes: ['id', 'name', 'description', 'artwork_filename'],
      });

      // find all episodes data
      const episodesData = await db.Episode.findAll({
        attributes: [['id', 'episode_id'], 'name', 'description', ['artwork_filename', 'episode_artwork'], 'podcast_ext_url'],
        // This performs a LEFT OUTER JOIN (means include everything in episode, and all the series info associated with these episodes)
        include: [{
          model: db.Series,
          attributes: ['id'],
        }],
      });

      // Assign loggedInUser details to temp data var
      data = assignLoggedInUserDetails(data, req);

      // Store all related values into data var
      data.series = seriesData.map((aSeriesData) => aSeriesData.dataValues);
      data.episodes = episodesData.map((episodeData) => episodeData.dataValues);

      // Adding series id to each episode
      data.episodes.forEach((episode) =>
      { episode.series_id = episode.Series.dataValues.id; });

      // if user chooses to play an episode... store the link inside data var
      if (req.query) {
        data.episodeLinkToPlay = req.query.episode_id;
      }

      // finally, render the series
      res.render('series/main', data);
    } catch (error) {
      console.log(error);
    }
  };
  return { index };
}
