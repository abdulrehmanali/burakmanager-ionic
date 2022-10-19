import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const allCustomers = async (name = '')=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['shop']['id'])+'/customers',{
    params: {
      search: name
    },
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
  return axios.get(baseUrl+'shops/'+(selectedShop['shop']['id'])+'/customers/'+id,{
    headers: {
      'Authorization': token
    } 
  });
}
export const createCustomer = async (name: string, email: string, phoneNumber: string, address: string, ntn: string, companyName: string)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/customers',{
      name,
      email,
      'phone_number':phoneNumber,
      'ntn':ntn,
      'address':address,
      'company_name':companyName,
  },{
    headers: {
      'Authorization': token
    },
  });
}
export const updateCustomer = async (id: string, name: string, email: string, phoneNumber: string, address: string, ntn: string, companyName: string)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/customers/'+id,{
    name,
    email,
    'phone_number':phoneNumber,
    'ntn':ntn,
    'address':address,
    'company_name':companyName,
  },{
    headers: {
      'Authorization': token
    },
  });
}
