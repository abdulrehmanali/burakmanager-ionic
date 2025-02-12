import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const getHome = async ()=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  const args: any = {
    headers: {
      'Authorization': token
    }
  };
  let url = baseUrl+'home/';
  if(selectedShop && selectedShop.shop && selectedShop.shop.id){
    url += selectedShop.shop.id
  }
  return axios.get(url,args);
}