import React,{useEffect, useState} from 'react'
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { updateService } from "../../services/Service";
const BackendUrl = import.meta.env.VITE_BACKEND_URL;
const AccessPoint = import.meta.env.VITE_ACCESS_POINT;


const Update = () => {
    const { id } = useParams();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [data, setData] = useState({
    ServiceName: "",
    ServiceType: "",
    ServiceDetails: "",
    Image: "",
  });

  // Fetch existing data
  const getService = async () => {
    try {
      // debug: removed console.log
      const res = await axios.get(`${BackendUrl}/${AccessPoint}/${id}`);
      setData({
        ServiceName: res.data.ServiceName,
        ServiceType: res.data.ServiceType,
        ServiceDetails: res.data.ServiceDetails.join(", "),
        Image: res.data.Image.url,
      });
      setImagePreview(res.data.Image.url);
    } catch (err) {
      // error logged removed for production
      toast.error("Failed to load service");
      
    }
  };
     useEffect(() => {
      const verifyAuth = async () => {
        const authorized = await checkAuth();
        if (!authorized) {
          navigate("/login");
          return;
        }
        
        // If not authorized, check if admin exists
        const adminExuseEffectists = await checkAdminExists();
        if (!adminExists) {
          // No admin in DB, redirect to create admin
          navigate("/");
          return;
        }
        else{
          getService();
        }
        setChecking(false);
      };
      verifyAuth();
    }, [navigate]);

  useEffect(() => {
    getService();
  }, []);

  // handle input
  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // submit update
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await updateService(id, data, newImage);
      toast.success("Service updated successfully");
      navigate("/list"); // redirect to list page
    } catch (err) {
      toast.error("Update failed");
      // error logged removed for production
    }
  };

  return (
     <div className="card card-body mt-4 col-md-4 border border-2 b">
      <h2>Edit Service</h2>

      <form onSubmit={onSubmitHandler}>
        <div className="mb-3">
          <label>Current Image</label> <br />
          <img src={imagePreview} width="120" height="120" alt="" />
          <label htmlFor="image" className="form-label text-primary">Click here for Update Image</label>
          <input
            type="file"
            className="form-control mt-2"
            id='image'
            required={false}
            onChange={(e) => {
              setNewImage(e.target.files[0]);
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </div>

        <div className="mb-3">
          <label>Service Name</label>
          <input
            type="text"
            className="form-control"
            name="ServiceName"
            value={data.ServiceName}
            onChange={onChangeHandler}
          />
        </div>

        <div className="mb-3">
          <label>Service Type</label>
          <input
            type="text"
            className="form-control"
            name="ServiceType"
            value={data.ServiceType}
            onChange={onChangeHandler}
          />
        </div>

        <div className="mb-3">
          <label>Service Details (comma separated)</label>
          <textarea
            className="form-control"
            name="ServiceDetails"
            value={data.ServiceDetails}
            onChange={onChangeHandler}
            rows="5"
          ></textarea>
        </div>

        <button className="btn btn-primary">Update Service</button>
      </form>
    </div>
  )
}

export default Update
