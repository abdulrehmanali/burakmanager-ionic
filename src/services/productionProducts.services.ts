import axios from "axios"
const baseUrl = process.env.VUE_APP_API_BASE_URL;
import { Storage } from '@ionic/storage';
const store = new Storage();

export const allProductionProducts = async (search: any = "")=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+selectedShop['shop']['id']+'/produciton-products',{
    params: {
      search: search
    },
    headers: {
      'Authorization': token
    } 
  });
}
export const getProductionProduct = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+selectedShop['shop']['id']+'/produciton-products/'+id,{
    headers: {
      'Authorization': token
    } 
  });
}
export const getProductionProductPdf = async (id: any)=>{
  store.create();
  const token = await store.get('token');
  let selectedShop = await store.get('selectedShop');
  selectedShop = JSON.parse(selectedShop);
  return axios.get(baseUrl+'shops/'+selectedShop['shop']['id']+'/produciton-products/'+id+'.pdf',{
    'responseType': 'blob',
    headers: {
      'Authorization': token,
    } 
  });
}
export const createProductionProduct = async (name: string, price: string, sku: string, products: Array<any>)=>{
  store.create();
  const token = await store.get('token');
  const selectedShop: any = JSON.parse(await store.get('selectedShop'));
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/produciton-products',{
    name,
    price,
    sku,
    products
  },{
    headers: {
      'Authorization': token
    },
  });
}
export const GenerateProduct = async (id: any, quantity: any)=>{
  store.create();
  const token = await store.get('token');
  const selectedShop: any = JSON.parse(await store.get('selectedShop'));
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/produciton-products/'+id+'/create-product',{
    quantity,
  },{
    headers: {
      'Authorization': token
    },
  });
}
export const updateProductionProduct = async (id: any, name: string, price: string, sku: string, products: Array<any>)=>{
  store.create();
  const token = await store.get('token');
  const selectedShop: any = JSON.parse(await store.get('selectedShop'));
  return axios.post(baseUrl+'shops/'+selectedShop['shop']['id']+'/produciton-products/'+id,{
    name,
    price,
    sku,
    products
  },{
    headers: {
      'Authorization': token
    },
  });
}