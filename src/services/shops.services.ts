import axios from "axios"
const baseUrl = "http://127.0.0.1:8000/api/";
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
export const create = async (name: string, address: string, invitations: Array<any>)=>{
  store.create();
  const token = await store.get('token');
  return axios.post(baseUrl+'shops',{
      name,
      address,
      invitations
  },{
    headers: {
      'Authorization': token
    },
  });
}
