<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/ledger"></ion-back-button>
        </ion-buttons>
        <ion-title>New Quick</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
            <CreditDebitToggle value={type} @onUpdate="type = $event.target.value"/>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-card-title style="margin: 10px 0px">{{type == 'credit' ? 'Customer':'Seller'}}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
              <ion-item lines="none">
                <ion-input v-model="customer.name" @keyup="getCustomers($event.target.value)" :value="customer.name" fill="outline" placeholder="Search"></ion-input>
                <ion-spinner v-if="loadingCustomers"></ion-spinner>
              </ion-item>
              <ion-item lines="none" v-if="customers.length && !loadingCustomers">
                <ion-list class="customer-list">
                  <ion-item
                    v-for="customer in customers"
                    :key="customer.email"
                    v-on:click="()=>{onCustomerClick(customer)}"
                    class="customer-list-item"
                  >
                  <ion-label color="primary">
                    <h2>{{ customer.name }}</h2>
                    <h4>{{ customer.contact_number }}</h4>
                  </ion-label>
                  </ion-item>
                </ion-list>
              </ion-item>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-card-title style="margin: 10px 0px">Product's</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item lines="none">
              <ion-input
                v-model="productSearch"
                :value="productSearch"
                @keyup="searchProduct"
                placeholder="Search"
              ></ion-input>
              <ion-spinner v-if="loadingCustomers"></ion-spinner>
            </ion-item>
            <ion-list lines="none" v-if="searchProducts.length" class="products-search-list">
              <ion-item
                v-for="(product, productkey) in searchProducts"
                :key="productkey"
                class="product-search-row"
              >
              <ion-grid  v-if="product.batches && product.batches.length">
                <ion-row>
                  <ion-label>
                    <h2>{{ product.name }}</h2>
                    <p>{{ product.sku }}</p>
                  </ion-label>
                </ion-row>
                <ion-row  v-for="(batch) in product.batches" :key="batch.id" class="product-batches">
                  <ion-col size="12">
                    <b>Selling Price: {{ batch.selling_price }}</b>
                    <p>{{ batch.quantity }} {{ batch.measurement_unit }} in stock</p>
                  </ion-col>
                </ion-row>
              </ion-grid>
              </ion-item>
            </ion-list>
            <ion-list>
              <ion-item v-if="selectedProducts.length">
                <ion-grid class="ion-hide-sm-down">
                  <ion-row>
                    <ion-col size="12" size-md='5'>
                      <ion-label> Name </ion-label>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-label> Quantity </ion-label>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-label> Rate </ion-label>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-label> Total </ion-label>
                    </ion-col>
                    <ion-col size="12" size-md='1'> </ion-col>  
                  </ion-row>
                </ion-grid>
              </ion-item>
              <ion-item
                v-for="(product, key) in selectedProducts"
                :key="product.sku"
                :value="product.sku"
              >
                <ion-grid>
                  <ion-row class="products-row">
                    <ion-col size="12" size-md='5'>
                      <ion-label>{{ product.product_name }}</ion-label>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-item lines="none">
                        <ion-label>{{ product.quantity }}</ion-label>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-item lines="none">
                        <ion-label>{{ product.rate }}</ion-label>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-item lines="none">
                      <ion-label>
                        {{ product.rate * product.quantity }}
                      </ion-label>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-md='1'>
                      <ion-button
                        @click="deleteSelectedProduct(key)"
                        class="ion-float-end"
                        :icon="trash"
                        color="danger"
                      >
                        <ion-icon :icon="trash"></ion-icon
                      ></ion-button>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content>
            <ion-card-title style="margin: 10px 0px">Payments's</ion-card-title>
              <ion-list>
                <ion-item v-for="(payment, k) in payments" :key="k">
                  <div>{{ payment.method }}</div>
                  <ion-col>
                    <ion-input
                      type="number"
                      @keyup="(payment.amount = $event.target.value)"
                      :value="payment.amount"
                      :maxlength="total"
                      class="ion-text-right"
                    ></ion-input>
                  </ion-col>
                </ion-item>
              </ion-list>

          </ion-card-content>
        </ion-card>

        <ion-card v-if="selectedProducts.length">
          <ion-card-content>
              <ion-item lines="none">
                <ion-label>Total: </ion-label>
                <ion-label slot="end">{{ getTotal() }}</ion-label>
              </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content>
              <ion-item lines="none">
                <ion-label position="floating">Note: </ion-label>
                <ion-textarea
                  @keyup="note = $event.target.value"
                  :value="note"
                ></ion-textarea>
              </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card v-if="errorMsg && (errorMsg instanceof String)">
          <ion-card-content class="error-message">
            {{ errorMsg }}
          </ion-card-content>
        </ion-card>

        <ion-card v-if="errorMsg && typeof errorMsg === 'object'">
          <ion-card-content
            class="error-message"
            v-for="msg in errorMsg"
            :key="msg[0]"
          >
            {{ msg[0] }}
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-content>
            <ion-button @click="crateNewEntry">Save</ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonBackButton,
  IonInput,
  onIonViewWillLeave
} from "@ionic/vue";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { trash, pencil, arrowDown, arrowUp } from "ionicons/icons";
import { createLedgerEntry } from "@/services/ledger.services";
import { allCustomers } from "@/services/customers.services";
import { allProducts } from "@/services/products.services";
import CreditDebitToggle from "@/views/components/ledger/CreditDebitToggle.vue";

export default {
  name: "NewQuick",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonInput,
    CreditDebitToggle
  },
  setup() {
    const state = reactive({
      errorMsg: "",
      type: "credit",
      selectedProducts: [] as any,
      customer: {} as any,
      customers: [] as any,
      productSearch:"" as any,
      searchProducts: [] as any,
      loadingProducts: false,
      searchProductToAdd: {
        id:null as any,
        name:null as any,
        batchId:null as any,
        price:null as any,
        quantity:null as any
      },
      payments: [
        {
          method:'cash',
          status:'received'
        },
        {
          method:'cheque',
          status:'received'

        },
        {
          method:'bankTransfer',
          status:'received'

        }
      ] as any,
      loadingCustomers: false,
      total: 0,
      amountReceived: 0,
      note: "",
      selectProductModelVue: "" as any,
      selectCustomerModelVue: "" as any,
    });
    let globalTimeout: any = null;
    let productsTimeout: any = null;
    const crateNewEntry = () => {
        createLedgerEntry({
          type: state.type,
          products: state.selectedProducts,
          payments: state.payments,
          'customer_id': state.customer.id,
          'customer_name': state.customer.name,
          total: state.total,
          note: state.note,
        }).then((res)=>{
          if (res.data.success) {
            router.back();
            return;
          }
          alert('Error!! '+res.data.message)
        }).catch(err=>{
          if(err.response.data.errors) {
            state.errorMsg = err.response.data.errors;
            return;
          }
          state.errorMsg = 'Error Please try again';
        });
        
    };
    const typeChanged = ($even: any) => {
      state.type = $even.detail.value;
    };
    const deleteSelectedProduct = (id: any) => {
      const sp = state.selectedProducts;
      sp.splice(id, 1);
      state.selectedProducts = sp;
      return true;
    };
    const getTotal = () => {
      state.total = state.selectedProducts
        .map((product: any) => {
          return product.rate * product.quantity;
        })
        .reduce((a: any, b: any) => a + b, 0);
      return state.total;
    };
    const getCustomers = (search = '') =>{
      state.customers = [];
      if (globalTimeout != null) {
        clearTimeout(globalTimeout);
        globalTimeout = null;
      }
      if (!search) {
        return;
      }
      state.loadingCustomers = true;
      globalTimeout = setTimeout(function() {
        globalTimeout = null;
        allCustomers(search).then(async(res)=>{
          state.customers = res.data.customers;
          state.loadingCustomers = false
        }).catch(err=>{
          alert("Please Check your internet")
        });
      }, 200);
    }
    const onCustomerClick = (customer: any)=>{
      state.customer = customer;
      state.customers = [];
      if (globalTimeout != null) {
        clearTimeout(globalTimeout);
      }
    }
    const addProduct = ()=>{
      state.selectedProducts.push({
        'batch_id': state.searchProductToAdd.batchId,
        'product_id': state.searchProductToAdd.id,
        'product_name': state.searchProductToAdd.name,
        sku: '',
        rate: state.searchProductToAdd.price,
        'purchasing_price': '',
        'measurement_unit': '',
        quantity: state.searchProductToAdd.quantity,
        stockQuantity: 1,
      });
    }
    function parseSearchStringToObject() {
      const objectToReturn = {
        name:'',
        batch:null,
        quantity:1,
        price:null
      } as any
      const productsSearchArray = state.productSearch.split(':')
      for (let i = 0; i < productsSearchArray.length; i++) {
        const element = productsSearchArray[i];
        if (i == 0) {
          objectToReturn.name = element
          continue
        }
        const [key, value] = element.split('=');
        if (key == 'b') {
          objectToReturn.batch = value
          continue
        }
        if (key == 'q') {
          objectToReturn.quantity = value
          continue
        }
        if (key == 'p') {
          objectToReturn.price = value
          continue
        }
      }
      // Add the name to the object
      return objectToReturn;
    }
    const searchProduct = (e: any) => {

      if (e.key == 'Enter') {
        console.log(state.searchProductToAdd)
        addProduct()
        state.productSearch=''
        state.searchProducts = [];
        return
      }
      const _productSearch = state.productSearch
      if (_productSearch.includes(':')) {
        const searchProductParsed = parseSearchStringToObject()
        if (state.searchProducts && state.searchProducts[0]) {
          state.searchProductToAdd.name = state.searchProducts[0]['name']
          state.searchProductToAdd.id = state.searchProducts[0]['id']

          if (searchProductParsed.batch != null && state.searchProducts[0]['batches'][searchProductParsed.batch]) {
            console.log(state.searchProducts[0]['batches'][searchProductParsed.batch])
            state.searchProductToAdd.batchId = state.searchProducts[0]['batches'][searchProductParsed.batch]['id']
            state.searchProductToAdd.price = state.searchProducts[0]['batches'][searchProductParsed.batch]['selling_price']
          }
        }

        state.searchProductToAdd.quantity = searchProductParsed.quantity
        if (searchProductParsed.price != null) {
          state.searchProductToAdd.price = searchProductParsed.price
        }

        return
      }
      state.searchProducts = [];
      if (productsTimeout != null) {
        clearTimeout(productsTimeout);
        productsTimeout = null;
      }
      state.loadingProducts = true;
      productsTimeout = setTimeout(function() {
        productsTimeout = null;
        allProducts(state.productSearch).then(async(res)=>{
          state.searchProducts = res.data.products;
          state.loadingProducts = false
        }).catch(()=>{
          alert("Please Check your internet")
        });
      }, 200);
    }
    const onProductClick = (product: any,productKey: any, batch: any) => {
      state.selectedProducts[productKey]['batch_id'] = batch.id
      state.selectedProducts[productKey]['product_id'] = product.id
      state.selectedProducts[productKey]['product_name'] = product.name
      state.selectedProducts[productKey]['sku'] = product.sku
      state.selectedProducts[productKey]['rate'] = batch.selling_price
      state.selectedProducts[productKey]['purchasing_price'] = batch.purchasing_price
      state.selectedProducts[productKey]['measurement_unit'] = batch.measurement_unit
      state.selectedProducts[productKey]['quantity'] = 1
      state.selectedProducts[productKey]['stockQuantity'] = batch.quantity
      state.selectedProducts[productKey]['showBatches'] = false
      if (productsTimeout != null) {
        clearTimeout(productsTimeout);
        productsTimeout = null;
      }
      state.selectedProducts[productKey]['searchProducts'] = []
      state.selectedProducts[productKey]['loadingProducts'] = false
    }
    const updateRequiredQuantity = ($event: any, product: any) => {
      if (productsTimeout != null) {
        clearTimeout(productsTimeout);
        productsTimeout = null;
      }
      product.searchProducts = []
      product.loadingProducts = false

      if(product.id == null) {
          product.quantity  = $event.target.value
          return;
      }
      if($event.target.value <= product.stockQuantity){
        product.quantity  = $event.target.value
      } else {
        product.quantity  = product.stockQuantity
      }
    }
    const deletePayment = (paymentId: number) => {
      state.payments.splice(paymentId, 1);
    }
    const addPayments = () => {
      state.payments.push({
        'method':'cash',
        'status': 'pending',
        'amount': 0.00,
        'bank_name': '',
        'transaction_id': '',
        'cheque_number': '',
      });
    }
    onIonViewWillLeave(() => {
      state.errorMsg =  "",
      state.type = "credit",
      state.selectedProducts = [] as any,
      state.customer = {} as any,
      state.customers = [] as any,
      state.searchProducts = [] as any,
      state.loadingProducts = false,
      state.loadingCustomers = false,
      state.total = 0,
      state.amountReceived = 0,
      state.note = "",
      state.selectProductModelVue = "" as any,
      state.selectCustomerModelVue = "" as any
    })
    return {
      ...toRefs(state),
      crateNewEntry,
      typeChanged,
      addProduct,
      addPayments,
      deleteSelectedProduct,
      trash,
      pencil,
      getTotal,
      getCustomers,
      onCustomerClick,
      searchProduct,
      onProductClick,
      arrowDown,
      arrowUp,
      updateRequiredQuantity,
      deletePayment
    };
  },
};
</script>

<style scoped>
.products-row {
  display: flex;
  align-items: center;
  justify-content: center;
}

.customer-list {
  width:100%;
}

.customer-list-item {
  width: 100%;
  cursor: pointer;
}

.customer-list-item:hover {
  color: #3dc2ff;
}

.product-row {
  padding: 6px 0;
}
.product-batches {
  cursor: pointer;
}
@media (prefers-color-scheme: dark) {
  .product-batches {
    padding:6px;
    background-color: #121212;
  }
}

.product-batches p {
  margin:0;
}

.product-search-row,
.product-search-row ion-grid,
.product-search-row ion-row 
.product-search-row ion-col{
  width: 100%;
}

.d-none {
  display: none;
}
</style>
