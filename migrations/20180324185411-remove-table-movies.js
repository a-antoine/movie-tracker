"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.dropTable("movies");
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.createTable("movies", {
			id: {
				field: "id",
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			title: {
				field: "title",
				type: Sequelize.STRING,
				allowNull: false
			},
			year: {
				field: "year",
				type: Sequelize.INTEGER,
				allowNull: false
			},
			runtime: {
				field: "runtime",
				type: Sequelize.INTEGER,
				allowNull: false
			},
			poster: {
				field: "poster",
				type: Sequelize.STRING,
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
	}
};
