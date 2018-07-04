module.exports = function(queryInterface, Sequelize) {
	return queryInterface.define("UserMovies", {
		userId: {
			field: "user_id",
			type: Sequelize.INTEGER,
			primaryKey: true
		},
		movieImdbId: {
			field: "movie_imdb_id",
			type: Sequelize.STRING,
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
	}, {
		tableName: "users_movies"
	});
};