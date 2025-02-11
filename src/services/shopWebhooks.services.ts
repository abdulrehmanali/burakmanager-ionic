import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const allShopWebHooks = async (search = {})=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['shop']['id'])+'/webhooks',{
    params: {...search},
    headers: {
      'Authorization': token
    } 
  });
}
export const createShopWebhook = async (platformName: string, receivingStoreUrl: string, authKey: string)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/webhooks',{
    'platform_name': platformName,
    'receiving_store_url': receivingStoreUrl,
    'auth_key': authKey,
  },{
    headers: {
      'Authorization': token
    },
  });
}
export const updateShopWebhook = async (id: any, platformName: string, receivingStoreUrl: string, authKey: string)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/webhooks/'+id,{
    'platform_name': platformName,
    'receiving_store_url': receivingStoreUrl,
    'auth_key': authKey,
  },{
    headers: {
      'Authorization': token
    },
  });
}