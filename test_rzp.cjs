require('dotenv').config();
const Razorpay = require('razorpay');

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env before running this script.');
  process.exit(1);
}

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
rzp.orders.create({ amount: 1000, currency: 'INR', receipt: 'receipt_test' })
  .then(console.log)
  .catch(console.error);
