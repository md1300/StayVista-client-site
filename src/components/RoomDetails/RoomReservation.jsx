import PropTypes from 'prop-types'
import Button from '../Shared/Button/Button';
import { DateRange } from 'react-date-range'
import { useState } from 'react';
import { differenceInCalendarDays } from 'date-fns';
import BookingModal from '../Modat/BookingModal';
import useAuth from '../../hooks/useAuth';

const RoomReservation = ({ room,refetch }) => {
  // console.log('started data ----->', new Date(room.from).toLocaleDateString(),'ended date ------->', new Date(room.to).toLocaleDateString())
  const [isOpen,setIsOpen]=useState(false)
  const {user}=useAuth()
  const [state, setState] = useState([
    {
      startDate: new Date(room.from),
      endDate: new Date(room.to),
      key: 'selection'
    }
  ]);

  const closeModal=()=>{
    setIsOpen(false)
  }

// total days * price ----------
  const totalPrice=parseInt(
    differenceInCalendarDays(new Date(room.to),new Date(room.from))
  )*room?.price ;
  console.log(totalPrice)

  return (
    <div className='rounded-xl border-[1px] border-neutral-200 overflow-hidden bg-white'>
      <div className='flex items-center gap-1 p-4'>
        <div className='text-2xl font-semibold'>$ {room?.price}</div>
        <div className='font-light text-neutral-600'>/night</div>
      </div>
      <hr />
      <div className='flex justify-center'>
        {/* Calender */}
        <DateRange
        showDateDisplay={false}
        rangeColors={['#ca8a04']}
  
  onChange={item =>{
    console.log(item)
    setState([
      {
        startDate: new Date(room.from),
        endDate: new Date(room.to),
        key: 'selection'
      }
    ])
  } }
  moveRangeOnFirstSelection={false}
  ranges={state}
/></div>
      <hr />
      <div className='p-4'>
        <Button disabled={room?.booked===true} 
        onClick={()=>setIsOpen(true)}
         label={room?.booked===true?'booked':'Reserve'} />
      </div>
      <BookingModal
      isOpen={isOpen}
      refetch={refetch}
      closeModal={closeModal}
      bookingInfo={{...room,price:totalPrice,guest:{name:user?.displayName,email:user.email,photo:user.photoURL}}}
      />
      <hr />
      <div className='p-4 flex items-center justify-between font-semibold text-lg'>
        <div>Total</div>
        <div>${totalPrice}</div>
      </div>
    </div>
  )
}

RoomReservation.propTypes = {
  room: PropTypes.object,
}

export default RoomReservation
