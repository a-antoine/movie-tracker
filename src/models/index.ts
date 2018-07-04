const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const sequelize = new Sequelize(
	process.env.MYSQL_DATABASE,
	process.env.MYSQL_USER,
	process.env.MYSQL_PASSWORD,
	{
		host: process.env.MYSQL_HOST,
		dialect: "mysql",
		operatorsAliases: Op,
		logging: false
	}
);

const models = [
	"OmdbapiUsage",
	"User",
	"UserMovies",
	"UserStat"
];
models.forEach(function(model) {
	module.exports[model] = sequelize.import(__dirname + "/" + model);
});

(function(m) {

	m.User.hasMany(m.UserMovies, {foreignKey: "userId"});
	m.UserMovies.belongsTo(m.User, {foreignKey: "userId"});

	m.UserStat.belongsTo(m.User, {foreignKey: "userId"});

})(module.exports);

module.exports.sequelize = sequelize;
