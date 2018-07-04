"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('movies', 'imdb_id', {
			type: Sequelize.STRING,
			after: "id"
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('movies', 'imdb_id');
	}
};
