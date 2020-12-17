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
      }, {
        name: 'Secrets and Séances',
        episode_number: 79,
        description: 'Helen Duncan was a famous medium who travelled around Britain in the 1940s performing séances. She claimed to speak to the dead, and even produce physical manifestations of their spirits. But when she seemed to know.',
        artwork_filename: 'https://podcast-app-artwork.s3-ap-southeast-1.amazonaws.com/1608028276342',
        podcast_ext_url: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/356824517&color=%23310b09&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const episode = await queryInterface.bulkInsert(
      'Episodes', episodesList, { returning: true },
    );
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
