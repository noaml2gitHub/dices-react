import axios from "axios";

export default axios.create({
  baseURL: "http://54.157.243.13:8080/",
  responseType: "json",
  timeout: 120000
});