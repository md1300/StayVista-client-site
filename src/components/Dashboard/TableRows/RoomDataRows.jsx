
import { format } from 'date-fns'
import { useState } from 'react';
import DeleteModal from '../../Modat/DeleteModal';

import PropTypes from 'prop-types';
import UpdateRoomModal from '../../Modat/UpdateRoomModal';

const RoomDataRows = ({ room,handleDelete,refetch }) => {
    let [isOpen, setIsOpen] = useState(false)
    let[isEditModalOpen,setIsEditModalOpen]=useState(false)
    const closeModal=()=>{
      setIsOpen(false)
    }
    
    return (
        <tr>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <div className='block relative'>
                <img
                  alt='profile'
                  src={room?.image}
                  className='mx-auto object-cover rounded h-10 w-15 '
                />
              </div>
            </div>
            <div className='ml-3'>
              <p className='text-gray-900 whitespace-no-wrap'>{room?.title}</p>
            </div>
          </div>
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          <p className='text-gray-900 whitespace-no-wrap'>{room?.location}</p>
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          <p className='text-gray-900 whitespace-no-wrap'>${room?.price}</p>
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          <p className='text-gray-900 whitespace-no-wrap'>
            {format(new Date(room?.from), 'P')}
          </p>
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          <p className='text-gray-900 whitespace-no-wrap'>
            {format(new Date(room?.to), 'P')}
          </p>
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
         
          {/* Delete modal */}
        
      <button onClick={() => setIsOpen(true)}> <span className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'>
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-red-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Delete</span>
          </span></button>
        <DeleteModal 
        isOpen={isOpen}
        closeModal={closeModal}
        handleDelete={handleDelete}
        id={room?._id}
        />
    
        </td>
        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
          <button onClick={()=>setIsEditModalOpen(true)} className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'>
            <span
              aria-hidden='true'
              className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
            ></span>
            <span className='relative'>Update</span>
          </button>
          {/* Update Modal */}
          <UpdateRoomModal
          isOpen={isEditModalOpen} 
          setIsEditModalOpen={setIsEditModalOpen}
          refetch={refetch}
          room={room}/>
        </td>
      </tr>
    );
};

RoomDataRows.propTypes = {
  setIsEditModalOpen: PropTypes.func,
  isOpen: PropTypes.bool,
  room:PropTypes.object,
  handleDelete:PropTypes.func,
  refetch:PropTypes.func


}

export default RoomDataRows;