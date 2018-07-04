"use strict";

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable("users", {
			id: {
				field: "id",
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			username: {
				field: "username",
				type: Sequelize.STRING,
				allowNull: false
			},
			password: {
				field: "password",
				type: Sequelize.STRING,
				allowNull: false
			},
			email: {
				email: "email",
				type: Sequelize.STRING,
				allowNull: false
			},
			role: {
				field: "role",
				type: Sequelize.ENUM("USER", "ADMIN"),
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
		return queryInterface.dropTable("users");
	}
};
