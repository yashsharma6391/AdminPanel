import axios from "axios";
import { toast } from "react-toastify";
const AccessPoint = import.meta.env.VITE_ACCESS_POINT
const BackendUrl = import.meta.env.VITE_BACKEND_URL;
const AdminPoint = import.meta.env.VITE_ACCESS_POINT_ADMIN;

const API_URL = `${BackendUrl}/${AccessPoint}`;
axios.defaults.withCredentials = true;
export const addService = async (data,image)=>{
    const formData = new FormData();
    // formData.append("food", JSON.stringify(foodData));
    formData.append("Image", image);
   formData.append("ServiceName", data.ServiceName);
  formData.append("ServiceType", data.ServiceType);
  formData.append("ServiceDetails", data.ServiceDetails);

     try {
      const response = await axios.post(API_URL+"/upload",
        formData,
       { withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" } }
      );
       return response.data;
      
    } catch (error) {
      alert("Error while adding food");
      // console removed for production
      throw error;
      
    }
}

export const getService = async () =>{
    try {
      // debug: api url removed
     const response = await axios.get(API_URL+"/services",{withCredentials:true});
      return response.data;
    } catch (error) {
        // Error fetching food list (console removed)
        // If admin deleted (404), logout
        if (error.response?.status === 404) {
          toast.error("Admin account deleted. Please create a new admin.");
          await logoutAdmin();
          window.location.href = "/";
        } else if (error.response?.status === 401) {
          toast.error("Unauthorized. Please login again.");
          window.location.href = "/login";
        }
        throw error;
    }
}

export const deleteService = async (foodId)=>{
  try {
      const response = await axios.delete(API_URL+"/"+foodId,{withCredentials:true})
   return response.status  === 200;
  } catch (error) {
    // error while deleting the food (console removed)
    // If admin deleted (404), logout
    if (error.response?.status === 404) {
      toast.error("Admin account deleted. Please create a new admin.");
      await logoutAdmin();
      window.location.href = "/";
    } else if (error.response?.status === 401) {
      toast.error("Unauthorized. Please login again.");
      window.location.href = "/login";
    }
    throw error; 
  }

}
export const updateService = async (id, updatedData, image) => {
 try {
   const formData = new FormData();

  if (updatedData.ServiceName)
    formData.append("ServiceName", updatedData.ServiceName);

  if (updatedData.ServiceType)
    formData.append("ServiceType", updatedData.ServiceType);

  if (updatedData.ServiceDetails)
    formData.append("ServiceDetails", updatedData.ServiceDetails);

  if (image) formData.append("Image", image);

  const res = await axios.patch(`${API_URL}/${id}`, formData,{
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
  return res.data;
 } catch (error) {
  // error logging removed for production
  // If admin deleted (404), logout
  if (error.response?.status === 404) {
    toast.error("Admin account deleted. Please create a new admin.");
    await logoutAdmin();
    window.location.href = "/";
  } else if (error.response?.status === 401) {
    toast.error("Unauthorized. Please login again.");
    window.location.href = "/login";
  }
 }
};

export const checkAuth = async () => {
  try {
    const res = await axios.get(`${BackendUrl}${AdminPoint}/check`, {
      withCredentials: true,
    });
      // response log removed for production
    // Return true when backend confirms admin; fall back to HTTP 200
    return res?.data?.message === "Admin verified" || res?.status === 200;

  } catch (err) {
    // error log removed for production
    // If admin was deleted (404) or any auth error, logout and redirect
    if (err.response?.status === 404) {
      // Admin was deleted - clear any local data and redirect
      await logoutAdmin();
      return false;
    }
    // Not authorized or request failed
    return false;
  }
};
  export const logoutAdmin = async () => {
  try {
    await axios.get(`${BackendUrl}${AdminPoint}/logout`,{ withCredentials: true });
    return true;
  } catch {
    return false;
  }
};

export const checkAdminExists = async () => {
  try {
    const res = await axios.get(`${BackendUrl}${AdminPoint}/exists`, {
      withCredentials: true,
    });
    return res?.data?.adminExists || false;
  } catch (err) {
    // error checking admin existence (console removed)
    return false;
  }
};
