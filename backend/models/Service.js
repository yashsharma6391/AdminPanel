import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema({
  Image: {url:{type: String, required: true},
  public_id: { type: String, required: true } 
 },
  ServiceName: { type: String, required: true },
  ServiceType: { type: String, required: true },
  ServiceDetails: { type: [String], required: true }
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model("Service", serviceSchema);