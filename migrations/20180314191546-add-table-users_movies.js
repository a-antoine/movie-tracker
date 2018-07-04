"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("users_movies", {
			userId: {
				field: "user_id",
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			movieId: {
				field: "movie_id",
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			viewedAt: {
				field: "viewed_at",
				type: Sequelize.DATE,
				allowNull: false
			},
			createdAt: {
				field: "created_at",
				type: Sequelize.DATE,
				allowNull: false
			},
			updatedAt: {
				field: "updated_at",
				type: Sequelize.DATE,
				allowNull: false
			}
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable("users_movies");
	}
};
