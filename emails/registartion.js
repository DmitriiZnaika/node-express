const keys = require('../keys')

module.exports = function (to) {
	return {
		to: to,
		from: keys.EMAIL_FROM,
		subject: 'Successful registration',
		html: `
		<div>
			<h1>Welcome!</h1>
			<p>You have successfully registered</p>
			<hr>
			
			<a href="${keys.BASE_URL}">Course Shop</a>
		</div>
`,
	}
}