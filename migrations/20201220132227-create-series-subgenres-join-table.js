module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add a join table between Series and Subgenres
    await queryInterface.createTable('Series_Subgenres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      SeriesId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Series',
          key: 'id',
        },
      },
      SubgenreId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Subgenres',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Series_Subgenres');
  },
};
