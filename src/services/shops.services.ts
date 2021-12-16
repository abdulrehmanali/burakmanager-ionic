import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const all = async ()=>{
  store.create();
  const token = await store.get('token');
  return axios.get(baseUrl+'shops',{
    headers: {
      'Authorization': token
    } 
  });
}
export const get = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  return axios.get(baseUrl+'shops/'+id,{
    headers: {
      'Authorization': token
    } 
  });
}
export const create = async (name: string, address: string,currency: string, invitations: Array<any>)=>{
  store.create();
  const token = await store.get('token');
  return axios.post(baseUrl+'shops',{
      name,
      address,
      currency,
      invitations
  },{
    headers: {
      'Authorization': token
    },
  });
}
export const update = async (id: string, name: string, address: string, currency: string, users: Array<any>, invitations: Array<any>)=>{
  store.create();
  const token = await store.get('token');
  return axios.post(baseUrl+'shops/'+id,{
      name,
      address,
      currency,
      users,
      invitations
  },{
    headers: {
      'Authorization': token
    },
  });
}
