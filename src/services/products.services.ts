import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const allProducts = async (search: any = "")=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+selectedShop['id']+'/products',{
    params: {
      search: search
    },
    headers: {
      'Authorization': token
    } 
  });
}
export const getProduct = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+selectedShop['id']+'/products/'+id,{
    headers: {
      'Authorization': token
    } 
  });
}
export const createProduct = async (name: string, sku: string, batches: Array<any>)=>{
  store.create();
  const token = await store.get('token');
  const selectedShop: any = JSON.parse(await store.get('selectedShop'));
  return axios.post(baseUrl+'shops/'+selectedShop['id']+'/products',{
    name,
    sku,
    batches
  },{
    headers: {
      'Authorization': token
    },
  });
}
export const updateProduct = async (id: string, name: string, sku: string, batches: Array<any>)=>{
  store.create();
  const token = await store.get('token');
  const selectedShop: any = JSON.parse(await store.get('selectedShop'));
  return axios.post(baseUrl+'shops/'+selectedShop['id']+'/products/'+id,{
    name,
    sku,
    batches
  },{
    headers: {
      'Authorization': token
    },
  });
}