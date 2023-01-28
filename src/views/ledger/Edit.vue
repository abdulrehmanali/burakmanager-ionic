<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/ledger"></ion-back-button>
        </ion-buttons>
        <ion-title>Edit Entry</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
            <ion-item lines="none">
              <ion-label>Entry Type</ion-label>
              <ion-select
                v-model="type"
                @change="type = $event.target.value"
                ok-text="Okay"
                cancel-text="Dismiss"
              >
                <ion-select-option value="credit" :selected="type == 'credit'"
                  >Credit</ion-select-option
                >
                <ion-select-option value="debit" :selected="type == 'debit'"
                  >Debit</ion-select-option
                >
              </ion-select>
            </ion-item>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-content>
            <ion-item lines="none">
              <ion-label>Date: {{createdAt}}</ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-row class="ion-align-items-start">
              <ion-col>
                <ion-card-title style="margin: 10px 0px"
                  >Product's</ion-card-title
                >
              </ion-col>
              <ion-col>
                <ion-button
                  @click="addProduct"
                  class="ion-float-end"
                  >Add Product</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-card-header>
          <ion-card-content>
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
                      <ion-item lines="none">
                        <ion-label class="ion-hide-sm-up">Name: </ion-label>
                        <ion-input
                          v-model="product.product_name"
                          :value="product.product_name"
                          @keyup="searchProduct(product)"
                          placeholder="Product Name"
                        ></ion-input>
                      </ion-item>
                      <ion-list lines="none" v-if="product.searchProducts?.length && !product.loadingProducts" class="products-search-list">
                        <ion-item
                          v-for="(product, productkey) in product.searchProducts"
                          :key="productkey"
                          class="product-search-row"
                        >
                        <ion-grid  v-if="product.batches && product.batches.length">
                          <ion-row>
                            <ion-col size="10">
                              <ion-label>
                                <h2>{{ product.name }}</h2>
                                <p>{{ (product.batches?product.batches.length:0) }} Batche(s), {{ product.batches?(product.batches.map(e=>{return e.quantity;}).reduce((total, num)=>{return total + Math.round(num)})):"" }} Item(s) Available</p>
                              </ion-label>
                            </ion-col>
                            <ion-col size="2">
                              <ion-button
                                @click="product.showBatches = ((!product.showBatches)?true:false)"
                                class="ion-float-end"
                                shape="round">
                                <ion-icon :icon="((!product.showBatches)?arrowDown:arrowUp)"></ion-icon
                              ></ion-button>
                            </ion-col>
                          </ion-row>
                          <ion-row  v-for="(batch) in product.batches" :key="batch.id" class="product-batches" :style="(!product.showBatches?'display:none':'')">
                            <ion-col size="12" v-if="batch.quantity > 0" v-on:click="onProductClick(product,key,batch)">
                              <b>Selling Price: {{ batch.selling_price }}</b>
                              <p>{{ batch.quantity }} {{ batch.measurement_unit }} in stock</p>
                            </ion-col>
                          </ion-row>
                        </ion-grid>
                        </ion-item>
                      </ion-list>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-item lines="none">
                        <ion-label class="ion-hide-sm-up">Quantity: </ion-label>
                        <ion-input
                          type="number"
                          v-model="product.quantity"
                          @keyup="updateRequiredQuantity($event, product)"
                          :value="product.quantity"
                          :maxlength="product.stockQuantity"
                          placeholder="Quantity"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-item lines="none">
                        <ion-label class="ion-hide-sm-up">Rate: </ion-label>
                        <ion-input
                          type="number"
                          v-model="product.rate"
                          @keyup="
                            product.rate =
                              $event.target.value >= product.purchasing_price
                                ? $event.target.value
                                : product.rate
                          "
                          :value="product.rate"
                          :minlength="product.purchasing_price"
                          placeholder="Rate"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-md='2'>
                      <ion-item lines="none">
                      <ion-label>
                        <span class="ion-hide-sm-up">Total: </span
                        >{{ product.rate * product.quantity }}
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
              <ion-item lines="none">
                <ion-label position="floating">Customer / Seller: </ion-label>
                <ion-input v-model="customer.name" @keyup="getCustomers($event.target.value)" :value="customer.name"></ion-input>
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
          <ion-card-content>
            <ion-row class="ion-align-items-start">
              <ion-col>
                <ion-card-title style="margin: 10px 0px"
                  >Payments's</ion-card-title
                >
              </ion-col>
              <ion-col>
                <ion-button
                  @click="addPayments"
                  class="ion-float-end"
                  >Add Payment</ion-button
                >
              </ion-col>
            </ion-row>
            <ion-list v-for="(payment, k) in payments" :key="k">
              <ion-item lines="none">
                <ion-label position="floating">Payment Method: </ion-label>
                <ion-select
                  v-model="payment.method"
                  @change="payment.method = $event.target.value"
                  ok-text="Okay"
                  cancel-text="Dismiss"
                >
                  <ion-select-option
                    value="cash"
                    :selected="payment.method == 'cash'"
                    >Cash</ion-select-option
                  >
                  <ion-select-option
                    value="cheque"
                    :selected="payment.method == 'cheque'"
                    >Cheque</ion-select-option
                  >
                  <ion-select-option
                    value="bankTransfer"
                    :selected="payment.method == 'bankTransfer'"
                    >Bank Transfer</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item lines="none">
                <ion-label position="floating">Payment Status: </ion-label>
                <ion-select
                  v-model="payment.status"
                  @change="payment.status = $event.target.value"
                  ok-text="Okay"
                  cancel-text="Dismiss"
                >
                  <ion-select-option
                    :value="((type == 'credit')?'received':'sended')"
                    :selected="payment.status == ((type == 'credit')?'received':'sended')"
                    >{{ ((type == 'credit')?'Received':'Sended') }}</ion-select-option
                  >
                  <ion-select-option
                    value="pending"
                    :selected="payment.status == 'pending'"
                    >Pending</ion-select-option
                  >
                  <ion-select-option
                    value="on-hold"
                    :selected="payment.status == 'on-hold'"
                    >On Hold</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item lines="none">
                <ion-label>{{type == 'credit' ? 'Recived':'Send'}} Amount: </ion-label>
                <ion-input
                  type="number"
                  @keyup="(payment.amount = $event.target.value)"
                  :value="payment.amount"
                  :maxlength="total"
                  class="ion-text-right"
                ></ion-input>
                <ion-label slot="end">Rs</ion-label>
              </ion-item>
              <ion-item lines="none"  v-if="payment.method == 'cheque' || payment.method == 'bankTransfer'">
                <ion-label position="floating">Bank Name: </ion-label>
                <ion-input
                  type="text"
                  @keyup="payment.bank_name = $event.target.value"
                  :value="payment.bank_name"
                ></ion-input>
              </ion-item>
              <ion-item lines="none" v-if="payment.method == 'cheque'">
                <ion-label position="floating">Cheque Number: </ion-label>
                <ion-input
                  type="text"
                  @keyup="payment.cheque_number = $event.target.value"
                  :value="payment.cheque_number"
                ></ion-input>
              </ion-item>
              <ion-item lines="floating" v-if="payment.method == 'bankTransfer'">
                <ion-label position="stacked">Transaction Id: </ion-label>
                <ion-input
                  type="text"
                  @keyup="payment.transaction_id = $event.target.value"
                  :value="payment.transaction_id"
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-button
                  @click="deletePayment(payment, k)"
                  class="ion-float-end"
                  >Delete Payment</ion-button
                >
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
            <ion-button @click="deleteEntry" class="ion-float-end" color="danger">Delete</ion-button>
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
  IonSelect,
  onIonViewWillLeave,
  onIonViewWillEnter,
  loadingController
} from "@ionic/vue";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { trash, pencil, arrowDown, arrowUp } from "ionicons/icons";
import { deleteEntryFromLedger, deleteLedgerEntry, getLedgerEntry, updateLedgerEntry } from "@/services/ledger.services";
import { allCustomers } from "@/services/customers.services";
import { allProducts } from "@/services/products.services";
import { useRoute } from 'vue-router';

export default {
  name: "NewProduct",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonInput,
    IonSelect,
  },
  setup() {
    const route = useRoute();
    const { id } = route.params;
    const state = reactive({
      errorMsg: "",
      type: "credit",
      createdAt: "",
      selectedProducts: [] as any,
      customer: {} as any,
      customers: [] as any,
      searchProducts: [] as any,
      loadingProducts: false,
      loadingCustomers: false,
      total: 0,
      note: "",
      selectProductModelVue: "" as any,
      selectCustomerModelVue: "" as any,
      payments: [] as any,
    });
    let globalTimeout: any = null;
    let productsTimeout: any = null;
    const getEntry = () => {
      getLedgerEntry(id).then((res)=>{
        state.selectedProducts = res.data.products
        const entry = res.data.entry;
        entry['created_at'] = new Date(entry.created_at)
        entry['created_at'] =  entry.created_at.getDate() + '/' + ("0"+entry.created_at.getMonth()).slice(-2) + '/' + entry.created_at.getFullYear()
        state.type = entry.type;
        state.customer = {}
        state.customer.id = entry.customer_id
        state.customer.name = entry.customer_name
        state.total = entry.total
        state.note = entry.note
        state.payments = entry.payments   
        state.createdAt = entry['created_at']
      }).catch(err=>{
        if(err.response.data.errors) {
          state.errorMsg = err.response.data.errors;
          return;
        }
        state.errorMsg = 'Error Please try again';
      });
    };
    onIonViewWillEnter(()=>{
      getEntry();
    })
    const deleteEntry = ()=>{
      deleteLedgerEntry(String(id)).then(()=>{
        router.back();
      }).catch(err=>{
        if(err.response.data.errors) {
          state.errorMsg = err.response.data.errors;
          return;
        }
        state.errorMsg = 'Error Please try again';
      });
  }
    const crateNewEntry = () => {
        updateLedgerEntry(String(id),
        {
          type: state.type,
          products: state.selectedProducts,
          'customer_id': state.customer.id,
          'customer_name': state.customer.name,
          total: state.total,
          note: state.note,
          payments: state.payments  
        }).then(()=>{
          router.back();
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
        'batch_id': '',
        'product_id': '',
        'product_name': '',
        sku: '',
        rate: '',
        'purchasing_price': '',
        'measurement_unit': '',
        quantity: 1,
        stockQuantity: 1,
        searchProducts: [],
        loadingProducts: false,
        showBatches: false
      });
    }
    // const recivedAmmountUpdate = (e: any) => {
    //   state.amountReceived = e.target.value;
    //   if (e.target.value >= state.total) {
    //     state.paymentStatus = ((state.type == 'credit')?'received':'sended')
    //   } else {
    //     state.paymentStatus = 'pending';
    //   }
    // }
    const searchProduct = (product: any) => {
      product.searchProducts = [];
      if (productsTimeout != null) {
        clearTimeout(productsTimeout);
        productsTimeout = null;
      }
      if (!product.product_name) {
        return;
      }
      product.loadingProducts = true;
      productsTimeout = setTimeout(function() {
        productsTimeout = null;
        allProducts(product.product_name).then(async(res)=>{
          product.searchProducts = res.data.products;
          product.loadingProducts = false
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
      product.quantity  = $event.target.value
      if(product.id == null) {
          return;
      }
      // if($event.target.value <= product.stockQuantity){
      //   product.quantity  = $event.target.value
      // } else {
      //   product.quantity  = product.stockQuantity
      // }
    }
    const deletePayment = async (paymentObject: any, paymentId: any) => {
      const loading = await loadingController.create({
        message: 'Deleting...',
      });
      loading.present()
      deleteEntryFromLedger(id, paymentObject.id).then(res=>{
        loading.dismiss()
        state.payments.splice(paymentId, 1);
      })
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
      state.note = "",
      state.selectProductModelVue = "" as any,
      state.selectCustomerModelVue = "" as any
    })
    return {
      ...toRefs(state),
      crateNewEntry,
      typeChanged,
      addProduct,
      deleteSelectedProduct,
      trash,
      pencil,
      getTotal,
      getCustomers,
      onCustomerClick,
      // recivedAmmountUpdate,
      searchProduct,
      onProductClick,
      arrowDown,
      arrowUp,
      updateRequiredQuantity,
      deleteEntry,
      deletePayment,
      addPayments
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
