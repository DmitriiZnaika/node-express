const toCurrency = (price) => {
	return new Intl.NumberFormat('en-US', {
		currency: 'USD',
		style: 'currency'
	}).format(price)
}

document.querySelectorAll('.price').forEach(node => {
	node.textContent = toCurrency(node.textContent)
})

const toDate = (date) => {
	return new Intl.DateTimeFormat('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
	node.textContent = toDate(node.textContent)
})

const $cart = document.querySelector("#cart")
if ($cart) {
	$cart.addEventListener('click', event => {
		if (event.target.classList.contains('js-remove')) {
			const id = event.target.dataset.id
			const csrf = event.target.dataset.csrf
			fetch('/cart/remove/' + id, {
				method: 'delete',
				headers: {'X-XSRF-TOKEN': csrf}
			}).then(res => res.json())
					.then(cart => {
						if (cart.courses.length) {
							const html = cart.courses.map(val => {
								return `
											<tr>
												<td>${val.title}</td>
												<td>${val.count}</td>
												<td>
														<button class="btn btn-small js-remove" data-id="${val._id}">
																Delete
														</button>
												</td>
										</tr>
						    `
							}).join('')
							$cart.querySelector('tbody').innerHTML = html
							$cart.querySelector('.price').textContent = toCurrency(cart.price)
						} else {
							$cart.innerHTML = '<p>Empty cart</p>'
						}
					})
		}
	})
}

M.Tabs.init(document.querySelectorAll('.tabs'));
