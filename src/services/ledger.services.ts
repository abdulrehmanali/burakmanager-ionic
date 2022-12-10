import axios from "axios"
import { Buffer } from 'buffer';
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const allLedgerEntries = async (search: object, print = false)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  const extraParam: any = {
    headers: {
      'Authorization': token
    },
    params: {...search, print}
  }
  if (print == true) {
    extraParam.responseType= 'blob';
  }
  return axios.get(baseUrl+'shops/'+(selectedShop['shop']['id'])+'/ledger',extraParam);
}
export const getLedgerEntry = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['shop']['id'])+'/ledger/'+id,{
    headers: {
      'Authorization': token
    } 
  });
}
export const deleteLedgerEntry = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.delete(baseUrl+'shops/'+(selectedShop['shop']['id'])+'/ledger/'+id,{
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
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/ledger',entry,{
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
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/ledger/'+id,entry,{
    headers: {
      'Authorization': token
    },
  });
}

export const getReciptUrl = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return baseUrl+'shops/'+selectedShop['shop']['id']+'/ledger/'+id+'/recipt';
}
export const getReciptBase64 = async (id: any)=>{
  const url = await getReciptUrl(id);
  return await axios
  .get(url, {
    responseType: 'arraybuffer'
  })
  .then(response => new Buffer(response.data, 'binary').toString('base64'))
}
export const getReciptHtml = async (id: any)=>{
  const url = await getReciptUrl(id);
  return await axios
  .get(url+'?html=true');
}