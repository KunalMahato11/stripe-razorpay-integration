import React, { useState } from 'react';
import './App.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ScriptTag from 'react-script-tag';

import StripeCheckout from 'react-stripe-checkout';

toast.configure();

function App() {
	const [product, setProduct] = useState({
		name: 'Donate',
		price: 100,
	});

	const makePayment = async (token) => {
		const response = await axios.post(process.env.REACT_APP_URL, {
			token,
			product,
		});

		const { status } = response.data;
		// console.log('Response : ', response.data);
		if (status === 'success') {
			toast('Success! Check email for details', { type: 'success' });
		} else {
			toast('Something went wrong', { type: 'error' });
		}
	};

	return (
		<div>
			<div  className="Container">
			<h1 className="main-heading">Donate</h1>
			<h3 className="sub-heading">For a better world</h3>
			<div className="para-container">
				<p className="para">
					Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nisi eius
					soluta quaerat non sequi dolorem maxime ipsa. Distinctio saepe amet,
					voluptatum minima modi in illo accusantium inventore a neque
					repudiandae!
				</p>
			</div>


			<div className="button-container">
				<StripeCheckout
						stripeKey={process.env.REACT_APP_PUBLISH_KEY}
						token={makePayment}
						image="https://svgshare.com/i/VDz.svg"
						name="Donate"
						description="Giving is the greatest act of grace"
						amount={product.price * 100}
						currency="INR"
					>
						<button className="btn black">
							Donate with Stripe
						</button>
					</StripeCheckout>

				<form>
					<ScriptTag
						src="https://checkout.razorpay.com/v1/payment-button.js"
						data-payment_button_id="pl_Goqv6LMLNtY5ay"
						async
					>
						{' '}
					</ScriptTag>{' '}
				</form>

			</div>


			</div>
		</div>
	);
}

export default App;
