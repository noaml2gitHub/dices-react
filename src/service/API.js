import axios from "axios";

export default axios.create({
  baseURL: "https://54.157.243.13:8080/",
  // baseURL: "https://localhost:8080/",
  responseType: "json",
  timeout: 120000
});