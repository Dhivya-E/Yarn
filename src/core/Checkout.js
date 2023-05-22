import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';

import {
  getProducts,
  getBraintreeClientToken,
  processPayment,
  createOrder,
} from './apiCore';
import { emptyCart } from './cartHelpers';
import Card from './Card';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DropIn from 'braintree-web-drop-in-react';

const Checkout = ({ products, setRun = (f) => f, run = undefined }) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    clientToken: null,
    error: '',
    instance: {},
    address: '',
  });
   const [isOpen, setIsOpen] = useState(false);
  const userId = isAuthenticated() && isAuthenticated().user._id;
  const token = isAuthenticated() && isAuthenticated().token;

  const getToken = (userId, token) => {
    // Fake client token for testing
    const fakeClientToken = 'fake-client-token';
  
    setData({ clientToken: fakeClientToken });
  };
  
  useEffect(() => {
    getToken(userId, token);
  }, []);
  const handleAddress = (event) => {
    setData({ ...data, address: event.target.value });
  };

  const getTotal = () => {
    return products.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.count * nextValue.price;
    }, 0);
  };

  const showCheckout = () => {
    return isAuthenticated() ? (
      <div>{showDropIn()}</div>
    ) : (
      <Link to='/signin'>
        <Button variant='contained' color='primary'>
          Sign in to checkout
        </Button>
      </Link>
    );
  };

  let deliveryAddress = data.address;

  const buy = () => {
    setData({ loading: true });
  
    // Create order
    const createOrderData = {
      products: products,
      amount: getTotal(products),
      address: deliveryAddress,
    };
  
    if (isAuthenticated()) {
      createOrder(userId, token, createOrderData)
        .then((response) => {
          emptyCart(() => {
            setRun(!run); // run useEffect in parent Cart
            console.log('Order created and cart emptied');
            setData({
              loading: false,
              success: true,
            });
          });
        })
        .catch((error) => {
          console.log(error);
          setData({ loading: false });
        });
    } else {
      // Handle case where user is not authenticated
      // Redirect to sign in or display an error message
      // For example:
      console.log('User not authenticated. Redirecting to sign in...');
      // Redirect to sign in page
      // history.push('/signin');
      // or display an error message
      setData({ loading: false, error: 'Please sign in to place an order.' });
    }
  };
  
  const showDropIn = () => (
    <div onBlur={() => setData({ ...data, error: '' })}>
      {data.clientToken !== null && products.length > 0 ? (
        <div>
          <div className='gorm-group mb-3'>
            <label className='text-muted'>Delivery address with Phone number:</label>
            <textarea
              onChange={handleAddress}
              className='form-control'
              value={data.address}
              placeholder='Type your delivery address here...'
            />
          </div>

          <DropIn
            options={{
              authorization: data.clientToken,
              paypal: {
                flow: 'vault',
              },
            }}
            
            onInstance={(instance) => (data.instance = instance)}
          />
          <button  onClick={() => setIsOpen(true)}className='btn btn-success btn-block'>
          Pay Online
        </button>
         {isOpen && (
       
        <div  style={{margin:"auto "}}>
          <input class="form-control  w-50 " type="number" placeholder='Enter credit card number'></input>
<br></br>
          <input class="form-control w-50" type="date" ></input>
          
          <button  onClick={buy}  className=' btn-primary w-25 p-1 m-2'>Pay</button>
        </div>
     
      
      )}
          <button onClick={buy} className='btn btn-success btn-block'>
            Cash on delivery
          </button>
        </div>
      ) : null}
    </div>
  );

  const showError = (error) => (
    <div
      className='alert alert-danger'
      style={{ display: error ? '' : 'none' }}
    >
      {error}
    </div>
  );

  const showSuccess = (success) => (
    <div
      className='alert alert-info'
      style={{ display: success ? '' : 'none' }}
    >
      Thanks! Your order was successful!
    </div>
  );

  const showLoading = (loading) =>
    loading && <h2 className='text-danger'>Loading...</h2>;

  return (
    <div>
      <h2>Total: ₹{getTotal()}</h2>
      {showLoading(data.loading)}
      {showSuccess(data.success)}
      {showError(data.error)}
      {showCheckout()}
    </div>
  );
};

export default Checkout;
