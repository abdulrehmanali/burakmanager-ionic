import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
export const login = (email: string, password: string)=>{
  return axios.post(baseUrl+'login',{
    email,
    password
  });
}
export const signup = (name: string, phoneNumber: string, email: string, password: string)=>{
  return axios.post(baseUrl+'signup',{
    name,
    'phone_number':phoneNumber,
    email,
    password
  });
}