import { BsFingerprint } from 'react-icons/bs'
import { GrUserAdmin } from 'react-icons/gr'
import MenuItem from './/MenuItem'
import useRole from '../../../../hooks/useRole'
import HostModal from '../../../Modat/HostRequestModal'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import useAxiosSecure from '../../../../hooks/useAxiosSecure'
import toast from 'react-hot-toast'
import useAuth from '../../../../hooks/useAuth'

const GuestMenu = () => {
  const [role] =useRole()
  const [isOpen,setIsOpen]=useState(false)
  const axiosSecure=useAxiosSecure()
  const {user}=useAuth()
  // close modal----------
  const closeModal=()=>{
    setIsOpen(false)
  }

  const {mutateAsync}=useMutation({
    mutationFn:async(currentUser)=>{
      const {data}=await axiosSecure.put('/user',currentUser)
      
      return data
    },
    onSuccess:(data)=>{
      console.log(data)
      if(data.modifiedCount>0){
        toast.success('Success! Please wait for admin confirmation !!')
      } 
      else{
        toast.success('Please!, Wait for admin approval👊 !!')
      }
      
    }
  })

  const modalHandler=async()=>{
     const currentUser={
      email:user?.email,
      role:'guest',
      status:'requested',
     }
     try{
      await mutateAsync(currentUser)

     }
     catch(error){
      console.log(error.message)
     }
     finally{
      closeModal()
     }
  }

  return (
    <>
      <MenuItem
        icon={BsFingerprint}
        label='My Bookings'
        address='my-bookings'
      />
{role==='guest' && (
  <div onClick={()=>setIsOpen(true)} className='flex items-center px-4 py-2 mt-5  transition-colors duration-300 transform text-gray-600  hover:bg-gray-300   hover:text-gray-700 cursor-pointer'>
        <GrUserAdmin className='w-5 h-5' />

        <span className='mx-4 font-medium'>Become A Host</span>
      </div>
     ) }
      <HostModal
      isOpen={isOpen}
      closeModal={closeModal}
      modalHandler={modalHandler} />
    </>
  )
}

export default GuestMenu