"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn("users_movies", "movie_id", {
			type: Sequelize.STRING
		});
		await queryInterface.renameColumn("users_movies", "movie_id", "movie_imdb_id");
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.changeColumn("users_movies", "movie_imdb_id", {
			type: Sequelize.INTEGER
		});
		await queryInterface.renameColumn("users_movies", "movie_imdb_id", "movie_id");
	}
};
