import axios from "axios"
const baseUrl = "http://127.0.0.1:8000/api/"
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