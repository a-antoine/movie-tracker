module.exports = function(queryInterface, Sequelize) {
	return queryInterface.define("OmdbapiUsage", {
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
	}, {
		tableName: "omdbapi_usage"
	});
};