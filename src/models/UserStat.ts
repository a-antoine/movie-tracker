module.exports = function(queryInterface, Sequelize) {
	return queryInterface.define("UserStat", {
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
	}, {
		tableName: "users_stat"
	});
};