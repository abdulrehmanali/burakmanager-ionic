import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const acceptInvitation = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  return axios.get(baseUrl+'invitaions/accept/'+id,{
    headers: {
      'Authorization': token
    }
  });
}

export const deleteInvitation = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.delete(baseUrl+'shops/'+selectedShop['id']+'/invitaions/'+id,{
    headers: {
      'Authorization': token
    }
  });
}