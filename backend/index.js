const cors = require('cors');
require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.SECRET_KEY);
const { v4: uuidv4 } = require('uuid');

const app = express();

//middleware
app.use(express.json());
app.use(cors());

//routes
app.get('/', (req, res) => {
	res.send('App is working');
});

app.post('/payment', async (req, res) => {
	let error;
	let status;
	try {
		const { product, token } = req.body;

		const customer = await stripe.customers.create({
			email: token.email,
			source: token.id,
		});

		const idempotencyKey = uuidv4();

		const charge = await stripe.charges.create(
			{
				amount: product.price * 100,
				currency: 'inr',
				customer: customer.id,
				receipt_email: token.email,
				description: `Donation`,
			},
			{
				idempotencyKey,
			}
		);
		status = 'success';
	} catch (error) {
		console.error('Error:', error);
		status = 'failure';
	}

	res.json({ error, status });
});

//Server
app.listen(process.env.PORT, () => {
	console.log(`Server listening at port ${process.env.PORT}`);
});
