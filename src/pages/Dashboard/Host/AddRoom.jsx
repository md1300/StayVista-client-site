import { useState } from "react";
import AddRoomForm from "../../../components/Form/AddRoomForm";
import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../Api/Utils";
import {useMutation,  } from '@tanstack/react-query'
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";


const AddRoom = () => {
    const {user}=useAuth()
    const navigate=useNavigate()
    const [imagePreview,setImagePreview]=useState();
    const axiosSecure=useAxiosSecure()
    const [loading,setLoading]=useState(false)
    const [imagetext,setImageText]=useState('upload image')
    const [dates,setDates]=useState({
        startDate:new Date(),
        endDate:null,
        key:'selection'
    })

    const handleDates=(item)=>{
          console.log(item)
          setDates(item.selection)
    }

    const {mutateAsync}=useMutation({
        mutationFn:async(roomData)=>{
            const {data}=await axiosSecure.post('/room',roomData)
            return data
        },
        onSuccess:()=>{
            console.log('finally added your room in database');
            toast.success('finally added room data in database');
            navigate('/dashboard/my-listings')
            setLoading(false)

        }
    })
    
    //-------------- form handler ----------------
    const handleSubmit =async(e)=>{
        e.preventDefault()
        setLoading(true)
        const form=e.target;
        const location=form.location.value;
        const category=form.category.value;
        const title=form.title.value;
        const to=dates.endDate;
        const from=dates.startDate;
        const price=form.price.value;
        const guests=form.total_guest.value;
        const bathrooms=form.bathrooms.value;
        const description=form.description.value;
        const bedrooms=form.bedrooms.value;
        const image=form.image.files[0]
        const host={
          name:user?.displayName,
          email:user?.email,
          image:user?.photoURL,
        }
        try{
           const image_url=await imageUpload(image)
        //    console.log(image_url)
           const roomData={
            location,category,title,to,from,price,guests,bathrooms,description,bedrooms,host,image:image_url,
           }
           console.table(roomData)
        //    post request to server -------------

          await mutateAsync(roomData)
        }
        catch(error){
            console.log(error)
            setLoading(false)
        }
    }

    // handle image change -----
    const handleImage=image=>{
        setImagePreview(URL.createObjectURL(image));
        setImageText(image.name);
    }
    return (
        <div>
            <Helmet>
        <title>add room | dashboard</title>
      </Helmet>
            
            {/* form */}
            <AddRoomForm 
            dates={dates} 
            handleDates={handleDates} 
            handleSubmit={handleSubmit}
            setImagePreview={setImagePreview}
            handleImage={handleImage}
            imagetext={imagetext}
            imagePreview={imagePreview}
            loading={loading}
            />
        </div>
    );
};

export default AddRoom;