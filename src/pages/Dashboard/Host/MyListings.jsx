
import { Helmet } from 'react-helmet-async'
import {useMutation, useQuery} from '@tanstack/react-query'
import useAxiosSecure from '../../../hooks/useAxiosSecure'
import useAuth from '../../../hooks/useAuth'
import LoadingSpinner from '../../../components/Shared/LoadingSpinner'
import RoomDataRows from '../../../components/Dashboard/TableRows/RoomDataRows'
import toast from 'react-hot-toast'

const MyListings = () => {

const {user}=useAuth()
const axiosSecure=useAxiosSecure()
const {data:rooms=[],isLoading,refetch} = useQuery({
  queryKey:['my listing',user?.email],
  queryFn:async()=>{
    const {data}=await axiosSecure.get(`/my-listings/${user?.email}`)
    // console.log(data)
    return data
  }  
})
// delete ---------

const {mutateAsync}=useMutation({
  mutationFn:async(id)=>{
    const {data}=await axiosSecure.delete(`/room/${id}`)
    return data
  },
  onSuccess:(data)=>{
 console.log(data)
 refetch()
 toast.success('successfully deleted')
  }
})

// handle delete button ---------------
const handleDelete=async(id)=>{
//  console.log(id)
 try{

  await mutateAsync(id)
 }
 catch(error){
  console.log(error.message)
 }

}

if(isLoading) return <LoadingSpinner/>

    return(
    <>
      <Helmet>
        <title>My Listings</title>
      </Helmet>

      <div className='container mx-auto px-4 sm:px-8'>
        <div className='py-8'>
          <div className='-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto'>
            <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
              <table className='min-w-full leading-normal'>
                <thead>
                  <tr>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Title
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Location
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Price
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      From
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      To
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Delete
                    </th>
                    <th
                      scope='col'
                      className='px-5 py-3 bg-white  border-b border-gray-200 text-gray-800  text-left text-sm uppercase font-normal'
                    >
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                    {/* Room row data */}
                    {rooms.map(room=><RoomDataRows 
                    key={room._id}
                    room={room}
                    refetch={refetch}
                    handleDelete={handleDelete}
                    ></RoomDataRows>)}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MyListings