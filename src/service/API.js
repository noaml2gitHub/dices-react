import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:8080/",
  baseURL: "http://18.159.130.95:8080/",
  responseType: "json",
  timeout: 120000
});