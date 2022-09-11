const keys = require('../keys')

module.exports = function (to, token) {
	return {
		to: to,
		from: keys.EMAIL_FROM,
		subject: 'Restoring access',
		html: `
		<div>
			<h1>You forgot password</h1>
			<p>If you don't forget passwrod ignore this email</p>
			<p>otherwise, follow the link below</p>
				<a href="${keys.BASE_URL}/auth/passwoord/${token}">Restore passord</a>
			<hr>
			
			<a href="${keys.BASE_URL}">Course Shop</a>
		</div>
`,
	}
}