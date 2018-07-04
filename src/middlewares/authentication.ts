let jwt = require('jsonwebtoken');

export = function (role?: string) {
	return function (req, res, next) {

		let token = req.cookies.token;

		if (token) {

			try {
				let tokenData = jwt.verify(token, process.env.JWT_SECRET);
				if ((role === 'USER' && (tokenData.role === 'USER' || tokenData.role === 'ADMIN')) ||
					(role === 'ADMIN' && tokenData.role === 'ADMIN') ||
					(role === undefined)
				) {

					res.locals.tokenData = tokenData;
					next();

				} else {

					return res.status(403).send({success: false, message: 'Insufficient authorization level'});
				}

			} catch (error) {

				return res.status(403).send({success: false, message: 'Failed to authenticate token.'});
			}

		} else {
			if (role) {

				return res.status(403).send({success: false, message: 'No token provided.'});

			} else {

				if (token) {
					res.locals.tokenData = jwt.verify(token, process.env.JWT_SECRET);
				}
				next();
			}
		}
	}
}