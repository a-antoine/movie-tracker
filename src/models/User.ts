const bcrypt = require("bcrypt-nodejs");

module.exports = function(queryInterface, Sequelize) {
	const User = queryInterface.define("User", {
		id: {
			field: "id",
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
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
	}, {
		tableName: "users"
	});

	User.prototype.generateHash = function (password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
	};

	User.prototype.validPassword = function (password) {
		return bcrypt.compareSync(password, this.password);
	};

	return User;
};