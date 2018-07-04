"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("users_stat", {
			userId: {
				field: "user_id",
				type: Sequelize.INTEGER,
				primaryKey: true
			},
			moviesCount: {
				field: "movies_count",
				type: Sequelize.INTEGER,
				allowNull: false
			},
			moviesWatchtime: {
				field: "movies_watchtime",
				type: Sequelize.INTEGER,
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
		return queryInterface.dropTable("users_stat");
	}
};
