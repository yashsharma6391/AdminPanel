import React, { useEffect, useState } from "react";
import { asserts } from "../../assets/asserts";
import axios from "axios";
import { addService } from "../../services/Service";
import { toast } from "react-toastify";
// import Service from "../../../../backend/models/Service";

const AddService = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    ServiceName:"",
    ServiceType: "",
    ServiceDetails: "",
   
  });
  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };
  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error("Please Select image.");
      return;
    }
    try {
      await addService(data, image);
      toast.success("Service Added Successfully");
        setData({
          ServiceName: "",
          ServiceType: "",
          ServiceDetails: "",
        });
        setImage(null);
      

    } catch (error) {
      toast.error("Error while adding Service")
      
    }
   
  };
  useEffect(() => {
    // debug data removed for production
  }, [data]);

  return (
    <div className="mx-2 mt-2">
      <div className="row ">
        <div className="card col-md-4">
          <div className="card-body">
            <h2 className="mb-4">Add Service</h2>
            <form onSubmit={onSubmitHandler}>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  <img
                    src={image ? URL.createObjectURL(image) : asserts.upload}
                    alt=""
                    width={50}
                    height={50}
                  />
                  Service img upload
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="image"
                  required
                  hidden
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Service Name
                </label>
                <input
                placeholder="Service"
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  name="ServiceName"
                  onChange={onChangeHandler}
                  value={data.ServiceName}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Service Type
                </label>
                <input
                placeholder="Service Type"
                  type="text"
                  className="form-control"
                  id="name"
                  required
                  name="ServiceType"
                  onChange={onChangeHandler}
                  value={data.ServiceType}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  ServiceDetails
                </label>
                <textarea
                  placeholder="Add list of Services in this Category"
                  className="form-control"
                  id="message"
                  rows="5"
                  required
                  name="ServiceDetails"
                  onChange={onChangeHandler}
                  value={data.ServiceDetails}
                ></textarea>
              </div>
              {/* <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  name="category"
                  id="category"
                  className="form-control"
                  onChange={onChangeHandler}
                  value={data.category}
                >
                  <option value="Biriyani">Biriyani</option>
                  <option value="Cake">Cake</option>
                  <option value="Burger">Burger</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Ice Cream">Ice Cream</option>
                  <option value="Salad">Salad</option>
                </select>
              </div> */}
              {/* <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  placeholder="&#8377;200"
                  type="number"
                  name="price"
                  className="form-control"
                  id="price"
                  onChange={onChangeHandler}
                  value={data.price}
                />
              </div> */}
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
