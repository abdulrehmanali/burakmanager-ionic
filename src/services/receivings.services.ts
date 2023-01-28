import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const allReceivings = async (search = {})=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['shop']['id'])+'/receiving',{
    params: {...search},
    headers: {
      'Authorization': token
    } 
  });
}
export const getReceiving = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+(selectedShop['shop']['id'])+'/receiving/'+id,{
    headers: {
      'Authorization': token
    } 
  });
}
export const createReceiving = async (method: string, status: string, amount: number, bankName: string, transactionId: string, chequeNumber: string, customerIid: string)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/receiving',{
    method: method,
    status: status,
    amount: amount,
    'bank_name': bankName,
    'transaction_id': transactionId,
    'cheque_number': chequeNumber,
    'customer_id': customerIid
  },{
    headers: {
      'Authorization': token
    },
  });
}
export const updateReceiving = async (id: any, method: string, status: string, amount: number, bankName: string, transactionId: string, chequeNumber: string, customerIid: string)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/receiving/'+id,{
    method: method,
    status: status,
    amount: amount,
    'bank_name': bankName,
    'transaction_id': transactionId,
    'cheque_number': chequeNumber,
    'customer_id': customerIid
  },{
    headers: {
      'Authorization': token
    },
  });
}

export const deductEntriesFromReceiving = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/receiving/'+id+'/deduct', {}, {
    headers: {
      'Authorization': token
    },
  });
}