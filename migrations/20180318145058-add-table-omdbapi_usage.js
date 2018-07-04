"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("omdbapi_usage", {
			date: {
				field: "date",
				type: Sequelize.DATEONLY,
				primaryKey: true,
				defaultValue: Sequelize.NOW
			},
			requestsCount: {
				field: "requests_count",
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
		return queryInterface.dropTable("omdbapi_usage");
	}
};
