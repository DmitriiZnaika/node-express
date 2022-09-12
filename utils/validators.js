const {body} = require('express-validator');

exports.registerValidators = [
	body('email').isEmail().withMessage('Enter correct email'),
	body('password').isLength({min: 6, max: 20}).isAlphanumeric().withMessage('Enter correct password'),
	body('confirm').custom((value, {req}) => {
		if (value !== req.body.password) {
			throw new Error('passwords need to be the same')
		}
		return true
	}),
	body('name').isLength({min: 3}).withMessage('Name need to be not less 3 symbols'),
]
