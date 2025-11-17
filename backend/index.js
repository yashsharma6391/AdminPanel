import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import serviceRoutes from "./routes/serviceRoutes.js";
import adminRoutes,{ adminAuth} from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({path: envFile});
const app = express();

const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL]

app.use(cors({
    origin: function(origin, callback){
        //  console.log("Incoming request from origin:", origin);
    if(!origin) return callback(null, true); // allow non-browser requests like Postman
    if(allowedOrigins.includes(origin)){
      return callback(null, true);
    } else {
      //  console.log("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));



app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI,
   
)
  .then(() => {/* MongoDB connected */})
  .catch(err => {/* mongodb connect error removed console */});

app.get(process.env.BASE_ROUTE, (req, res) => {
  
  res.send("Backend running successfully 🚀");
});
app.use(process.env.ADMIN_ROUTE, adminRoutes);
app.use(process.env.API_ROUTE,adminAuth, serviceRoutes);

const PORT = process.env.PORT || 5000;
// Environment log removed for production
app.listen(PORT, () => {/* server started */});
