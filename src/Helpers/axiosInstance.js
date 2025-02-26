import axios from "axios";

// const BASE_URL = "https://lmsbackend-3etv.onrender.com/api/v1";
// const BASE_URL = "https://api.lms.janardhanchaturvedi.in/api/v1";
const BASE_URL = "http://localhost:5014/api/v1";



const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
