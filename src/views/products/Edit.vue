<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/products" />
        </ion-buttons>
        <ion-title>Edit Product</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Name*</ion-label>
                      <ion-input
                        v-model="product.name"
                        @input="product.name = $event.target.value"
                        :value="product.name"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">SKU*</ion-label>
                      <ion-input
                        @input='onSkuInput($event.target.value)'
                        :value='product.sku'
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                  <ion-col>
                    <ion-button color="primary" v-on:click="openScanner()" class="ion-float-end"
                      >Scan</ion-button
                    >
                  </ion-col>
                </ion-row>
              </ion-grid>
          </ion-card-content>
        </ion-card>
        <ion-card>
          <ion-card-header>
            <ion-row class="ion-align-items-start">
              <ion-col>
                <ion-card-title style="margin: 10px 0px"
                  >Batches</ion-card-title
                >
              </ion-col>
              <ion-col>
                <ion-button @click="addBatch" class="ion-float-end"
                  >Add New</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-card-header>
          <ion-card-content>
            <ion-row v-for="(batch, id) in product.batches" :key="id">
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Purchase Date*: </ion-label>
                  <ion-input
                    v-model="batch.purchased_at"
                    type="date"
                    @input="batch.purchased_at = $event.target.value"
                    :value="batch.purchased_at?Intl.DateTimeFormat('sv-SE').format(new Date(batch.purchased_at)):''"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Expiry Date: </ion-label>
                  <ion-input
                    v-model="batch.expire_at"
                    type="date"
                    @input="batch.expire_at = $event.target.value"
                    :value="batch.expire_at?Intl.DateTimeFormat('sv-SE').format(new Date(batch.expire_at)):''"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Purchase Price*: </ion-label>
                  <ion-input
                    v-model="batch.purchasing_price"
                    type="number"
                    @input="batch.purchasing_price = $event.target.value"
                    :value="batch.purchasing_price"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Selling Price*: </ion-label>
                  <ion-input
                    v-model="batch.selling_price"
                    @input="batch.selling_price = $event.target.value"
                    :value="batch.selling_price"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Quantity*: </ion-label>
                  <ion-input
                    v-model="batch.quantity"
                    @input="batch.quantity = $event.target.value"
                    :value="batch.quantity"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Measurement Unit*: </ion-label>
                  <ion-select
                    v-model="batch.measurement_unit"
                    @change="batch.measurement_unit = $event.target.value"
                    ok-text="Okay"
                    cancel-text="Dismiss"
                  >
                    <ion-select-option :value="am.key" v-for="am in availableMeasurementUnits" :key="am.key" :selected="batch.measurement_unit == am.key">{{am.name}}</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Status: </ion-label>
                  <ion-select
                    @change="batch.status = $event.target.value"
                    ok-text="Okay"
                    cancel-text="Dismiss"
                    value="active"
                  >
                    <ion-select-option value="active" selected>Active</ion-select-option>
                    <ion-select-option value="in-production" selected>In Production</ion-select-option>
                    <ion-select-option value="in-quarantine" selected>In Quarantine</ion-select-option>
                    <ion-select-option value="on-hold" selected>On Hold</ion-select-option>
                    <ion-select-option value="expired" selected>Expired</ion-select-option>
                    <ion-select-option value="out-of-stock" selected>Out Of Stock</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-button @click="deleteBatch(id)" class="ion-float-end" color="danger">Delete</ion-button>
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-card-content>
        </ion-card>
        <ion-button expand="block" type="submit" @click="saveProduct()" :disabled="disableSaveButton">Save</ion-button>
        <ion-card>
          <ion-card-content v-if="errorMsg" class="error-message">
            {{ errorMsg }}
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, IonBackButton, IonSelect, onIonViewWillEnter } from "@ionic/vue";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { getProduct, updateProduct } from "@/services/products.services";

export default {
  name: "EditProduct",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonSelect
  },
  setup() {
    const route = useRoute();
    const { sku } = route.params;
    
    const state = reactive({
      product: {
        id: "",
        sku:""
      } as any,
      errorMsg: "",
      disableSaveButton:true,
      availableMeasurementUnits:[
        {'key':'centigram','name':"Centigram (cg)"},
        {'key':'centilitre','name':"Centilitre (cL)"},
        {'key':'decagram','name':"Decagram (dag)"},
        {'key':'decalitre','name':"Decalitre (daL)"},
        {'key':'decigram','name':"Decigram (dg)"},
        {'key':'decilitre','name':"Decilitre (dL)"},
        {'key':'gram','name':"Gram (g)"},
        {'key':'hectogram','name':"Hectogram (hg)"},
        {'key':'hectolitre','name':"Hectolitre (hL)"},
        {'key':'kilo','name':"Kilo (k)"},
        {'key':'kilogram','name':"Kilogram (kg)"},
        {'key':'kilolitre','name':"Kilolitre (kL)"},
        {'key':'litre','name':"Litre (L)"},
        {'key':'milligram','name':"Milligram (mg)"},
        {'key':'millilitre','name':"Millilitre (mL)"},
        {'key':'piece','name':"Piece(s)"},
        {'key':'tonne','name':"Tonne (t)"}
      ]
    });
    const openScanner = async () => {
      QRScanner.prepare()
        .then((status: QRScannerStatus) => {
          if (status.authorized) {
            // camera permission was granted
            // start scanning
            const scanSub = QRScanner.scan().subscribe((text: string) => {
              QRScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning
              state.product.sku = text;
            });
          } else if (status.denied) {
            alert("Please give camera permission");
            QRScanner.openSettings();
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
          }
        })
        .catch((e: any) => alert(e));
    };

    const getProductFromServer = async () => {
      try {
        const product = await getProduct(sku)
        state.product = product.data.product;
        state.disableSaveButton = false;
      } catch (error) {
        state.errorMsg = error.message;
      }
    };

    const saveProduct = async () => {
      if(!state.product.name){
        state.errorMsg = "Product Name is required";
        return;
      }
      if(!state.product.sku){
        state.errorMsg = "Product SKU is required";
        return;
      }
      if(!state.product.batches || !state.product.batches.length){
        state.errorMsg = "Atleast one Batch is required";
        return;
      }
      updateProduct(state.product.id,state.product.name,state.product.sku,state.product.batches).then((res: any)=>{
         if(res.data.error){
          state.errorMsg = res.response.data.error;
          return;
        }
        state.disableSaveButton = false;
        router.push("/products");
      }).catch((res: any)=>{
        state.disableSaveButton = false;
        console.log(res.response.data);
        if(!res.response.data.error || !res.response.data.errors){
          state.errorMsg = "Error Please check your internet conneciton and try again";
          return;
        }
        if(res.response.data.error){
          state.errorMsg = res.response.data.error;
        }
        if(res.response.data.errors){
          state.errorMsg = res.response.data.errors;
        }
      })
    };
    onIonViewWillEnter(() => {
      getProductFromServer();
    });
    const onSkuInput = (sku: any)=>{
      state.product.sku = sku.replaceAll(/^\s+|\s+$/g,'').replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    }
    const addBatch = ()=>{
      state.product.batches.push({
        'purchased_at':"",
        'purchasing_price': 0,
        quantity: 0,
        'measurement_unit':"piece",
        'selling_price':0
      });
    }
    const deleteBatch = (id: any)=>{
      if(confirm("Are you sure?")){
        const batches = state.product.batches
        batches.splice(id, 1)
        state.product.batches = batches
      }
    }
    return { ...toRefs(state), openScanner, saveProduct, router, onSkuInput, addBatch, deleteBatch };
  },
};
</script>
<style scoped></style>