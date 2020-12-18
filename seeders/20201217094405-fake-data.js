module.exports = {
  up: async (queryInterface) => {
    const seriesList = [
      {
        name: 'CWT',
        description: 'best podcast ever!',
        artwork_filename: 'https://podcast-app-artwork.s3-ap-southeast-1.amazonaws.com/1608028136956',
        createdAt: new Date(),
        updatedAt: new Date(),

      },
      {
        name: 'CWT',
        description: 'best podcast ever!',
        artwork_filename: 'https://podcast-app-artwork.s3-ap-southeast-1.amazonaws.com/1608028136956',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const series = await queryInterface.bulkInsert(
      'Series', seriesList, { returning: true },
    );

    const episodesList = [
      {
        name: 'Photo, Hair, Fingerprint',
        episode_number: 80,
        description: 'In 1988, a man in Hickory, NC was sentenced to life in prison based on evidence that experts would later call "junk science." It took him 24 years to convince someone to look at the evidence again.',
        artwork_filename: 'https://podcast-app-artwork.s3-ap-southeast-1.amazonaws.com/1608028276342',
        podcast_ext_url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/363307148&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
        createdAt: new Date(),
        updatedAt: new Date(),
        SeriesId: 1,
      }, {
        name: 'Secrets and Séances',
        episode_number: 79,
        description: 'Helen Duncan was a famous medium who travelled around Britain in the 1940s performing séances. She claimed to speak to the dead, and even produce physical manifestations of their spirits. But when she seemed to know.',
        artwork_filename: 'https://podcast-app-artwork.s3-ap-southeast-1.amazonaws.com/1608028276342',
        podcast_ext_url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/356824517&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
        createdAt: new Date(),
        updatedAt: new Date(),
        SeriesId: 1,
      },
    ];

    const episode = await queryInterface.bulkInsert(
      'Episodes', episodesList, { returning: true },
    );

    const genresList = [
      {
        name: 'Arts',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Business',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Comedy',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Education',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fiction',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Government',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Health & Fitness',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'History',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Kids & Family',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Leisure',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Music',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'News',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Religion & Spirituality',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Science',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Society & Culture',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Sports',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Technology',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'True Crime',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'TV & Film',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Genres', genresList, { returning: true });

    const subgenresList = [
      {
        name: 'Books',
        GenreId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Design',
        GenreId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Fashion & Beauty',
        GenreId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Other',
        GenreId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Careers',
        GenreId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Entrepreneurship',
        GenreId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Investing',
        GenreId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Other',
        GenreId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Interviews',
        GenreId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Improv & Stand Up',
        GenreId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Other',
        GenreId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert('Subgenres', subgenresList, { returning: true });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
