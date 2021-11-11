import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const allCustomers = async ()=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['id'])+'/customers',{
    headers: {
      'Authorization': token
    } 
  });
}
export const getCustomer = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['id'])+'/customers/'+id,{
    headers: {
      'Authorization': token
    } 
  });
}
export const createCustomer = async (name: string, email: string, phoneNumber: string)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['id']+'/customers',{
      name,
      email,
      'phone_number':phoneNumber,
  },{
    headers: {
      'Authorization': token
    },
  });
}
export const updateCustomer = async (id: string, name: string, email: string, phoneNumber: string)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['id']+'/customers/'+id,{
    name,
    email,
    'phone_number':phoneNumber,
  },{
    headers: {
      'Authorization': token
    },
  });
}
