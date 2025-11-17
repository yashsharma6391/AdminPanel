import express from "express";
import Service from "../models/Service.js";
import cloudinary from "../config/cloudinary.js";
import upload from "../middelware/multer.js";
import { adminAuth } from "./adminRoutes.js";

const router = express.Router();
router.post("/upload", adminAuth, upload.single("Image"), async (req, res) => {
  try {
    const { ServiceName, ServiceType, ServiceDetails } = req.body;
    const result = req.file; // Cloudinary upload result via Multer
    const newService = new Service({
      Image: {
        url: result.path,
        public_id: result.filename,
      },
      ServiceName,
      ServiceType,
      
      ServiceDetails: ServiceDetails.split(",").map(i => i.trim()),
    });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding service" });
  }
});
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // delete from Cloudinary
    await cloudinary.uploader.destroy(service.Image.public_id);

    // delete from DB
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting service" });
  }
});
router.patch("/:id", adminAuth, upload.single("Image"), async (req, res) => {
  try {
    const { id } = req.params;

    let service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    // If a new image is uploaded → delete old image from Cloudinary
    if (req.file) {
      if (service.Image.public_id) {
        await cloudinary.uploader.destroy(service.Image.public_id);
      }

      service.Image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    // Update only provided fields
    if (req.body.ServiceName) service.ServiceName = req.body.ServiceName;
    if (req.body.ServiceType) service.ServiceType = req.body.ServiceType;
    if (req.body.ServiceDetails) {
      service.ServiceDetails = req.body.ServiceDetails.split(",").map((i) => i.trim());
    }

    await service.save();

    res.json({ message: "Service updated successfully", service });
  } catch (err) {
    // console removed for production
    res.status(500).json({ message: "Error updating service" });
  }
});
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error fetching services", error: err });
  }
});
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching service" });
  }
});
// ServiceDetails: JSON.parse(ServiceDetails),
export default router;
