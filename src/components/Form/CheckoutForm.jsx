import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import './CheckoutForm.css'
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';
import {ImSpinner9} from 'react-icons/im'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'

const CheckoutForm = ({closeModal,bookingInfo,refetch}) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure=useAxiosSecure()
    const [clientSecret,setClientSecret]=useState()
    const [processing,setProcessing]=useState(false)
    const [cardError,setCardError]=useState('')
    const {user}=useAuth()
    const navigate=useNavigate()
  

    useEffect(()=>{
        if(bookingInfo?.price && bookingInfo?.price>1){
            getClientSecret({price:bookingInfo?.price})
        }
      
    },[bookingInfo?.price])

    const  getClientSecret=async(price)=>{
        const {data}= await axiosSecure.post('/create-payment-intent',price)
        console.log('client secret from server --->',data)
        setClientSecret(data.clientSecret)
    }

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();
        setProcessing(true)
        if (!stripe || !elements) {
          // Stripe.js has not loaded yet. Make sure to disable
          // form submission until Stripe.js has loaded.
          return;
        }
    
        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const card = elements.getElement(CardElement);
    
        if (card == null) {
          return;
        }
    
        // Use your card Element with other Stripe.js APIs
        const {error, paymentMethod} = await stripe.createPaymentMethod({
          type: 'card',
          card,
        });
    
        if (error) {
            setCardError(error.message)
          console.log('[error]', error);
          setProcessing(false)
          return
        } else {
          console.log('[PaymentMethod]', paymentMethod);
          setCardError('')
        }

        // confirm prament ----

        const {error:confirmError,paymentIntent}=await stripe.confirmCardPayment(clientSecret,{
            payment_method:{
                card:card,
                billing_details:{
                    email:user.email,
                    name:user.displayNamme,
                }
            }
        })

        if(confirmError){
            console.log(confirmError)
            setCardError(confirmError.message)
            setProcessing(false)
            return
        }
        if(paymentIntent.status==='succeeded'){
            console.log(paymentIntent)
            // 1. create payment objet info
            const paymentInfo={
                ...bookingInfo,
                transactionId:paymentIntent.id,
                data:new Date(),
                roomId:bookingInfo._id,
            };
            delete paymentInfo._id
            console.log(paymentInfo)
          try{
              // 2. seve payment info in booking collection (db)
            const {data}=await axiosSecure.post('/booking',paymentInfo)
            console.log(data)
            // 3. change room status to booked in db
            await axiosSecure.patch(`/room/status/${bookingInfo?._id}`,{status:true})

            refetch()
            closeModal()
            toast.success('Room Booked Successfully')
            navigate('/dashboard/my-bookings')

          }
          catch(error){
            console.log(error.message)
          }
        }
      setProcessing(false)
      };

    return (
        <div>
             <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
     
      <div className='flex mt-2 justify-around'>
                <button
                    type='submit'
                    className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                    disabled={!stripe}
                  >{
                    processing?<ImSpinner9 className='animate-spin' size={24}/>:`pay $ ${bookingInfo.price}`
                  }
                  
                  </button>
                  <button
                   onClick={closeModal}
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                  >
                  No
                  </button>
                
                 
                </div>
    </form>
    {cardError &&  <p className='text-red-600 ml-8'>{cardError}</p>}
        </div>
    );
};

export default CheckoutForm;
CheckoutForm.propTypes = {
    bookingInfo: PropTypes.object,
    closeModal: PropTypes.func,
    
  }