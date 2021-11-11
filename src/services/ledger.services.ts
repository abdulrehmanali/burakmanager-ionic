import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const allLedgerEntries = async ()=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['id'])+'/ledger',{
    headers: {
      'Authorization': token
    } 
  });
}
export const getLedgerEntry = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['id'])+'/ledger/'+id,{
    headers: {
      'Authorization': token
    } 
  });
}
export const createLedgerEntry = async (entry: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['id']+'/ledger',entry,{
    headers: {
      'Authorization': token
    },
  });
}
export const updateLedgerEntry = async (id: string, entry: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['id']+'/ledger/'+id,entry,{
    headers: {
      'Authorization': token
    },
  });
}
