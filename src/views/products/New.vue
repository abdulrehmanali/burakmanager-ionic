<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/products" />
        </ion-buttons>
        <ion-title>New Product</ion-title>
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
                        v-model="name"
                        @input="name = $event.target.value"
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
                        :value='sku'
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
            <ion-row v-for="(batch, id) in batches" :key="id">
              <ion-col size="6">
                <ion-item>
                  <ion-label position="stacked">Purchase Date*</ion-label>
                  <ion-input
                    v-model="batch.purchaseDate"
                    type="date"
                    @input="batch.purchaseDate = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="6">
                <ion-item>
                  <ion-label position="floating">Purchase Price*</ion-label>
                  <ion-input
                    v-model="batch.purchasePrice"
                    type="number"
                    @input="batch.purchasePrice = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="6">
                <ion-item>
                  <ion-label position="floating">Quantity*</ion-label>
                  <ion-input
                    v-model="batch.stockQuantity"
                    @input="batch.stockQuantity = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="6">
                <ion-item>
                  <ion-label position="stacked">Measurement Unit*</ion-label>
                  <ion-select
                    v-model="measurementUnit"
                    @change="batch.measurementUnit = $event.target.value"
                    ok-text="Okay"
                    cancel-text="Dismiss"
                  >
                    <ion-select-option :value="am.key" v-for="am in availableMeasurementUnits" :key="am.key">{{am.name}}</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col size="6">
                <ion-item>
                  <ion-label position="floating">Selling Price*</ion-label>
                  <ion-input
                    v-model="batch.sellingPrice"
                    @input="batch.sellingPrice = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="6">
                <ion-button @click="deleteBatch(id)" class="ion-float-end">Delete</ion-button>
              </ion-col>
            </ion-row>
          </ion-card-content>
        </ion-card>
        <ion-button expand="block" type="submit" @click="createNewProduct()" :disabled="disableCreateButton">Create</ion-button>
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
import { IonContent, IonPage, IonBackButton, IonSelect } from "@ionic/vue";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { db } from "@/main";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { Storage } from '@ionic/storage';

export default {
  name: "NewProduct",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonSelect
  },
  setup() {
    const store = new Storage();
    const state = reactive({
      name: "",
      price: "",
      sku: "",
      salePrice: "",
      stockQuantity: "",
      onSale: "",
      inventoryEnabled: "",
      errorMsg: "",
      measurementUnit: "piece",
      batches:[] as any,
      disableCreateButton:false,
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
        {'key':'tonne','name':"Tonne (t)"},
        {'key':'packet','name':"Packet"}
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
              state.sku = text;
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
    const createNewProduct = async () => {
      state.errorMsg = "";
      state.disableCreateButton = true;
      state.sku = state.sku.replaceAll(/^\s+|\s+$/g,'').replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
      if(!state.name){
        state.errorMsg = "Name is required";
        state.disableCreateButton = false;
        return;
      }
      if(!state.sku){
        state.errorMsg = "SKU is required";
        state.disableCreateButton = false;
        return;
      }
      if(!state.batches.length){
        state.errorMsg = "Atleast one batch is required";
        state.disableCreateButton = false;
        return;
      }
      let haveNullBatch = false;
      state.batches.forEach((element: any,k: any) => {
        const isEmpty = Object.values(element).every(x => x == null || x == '');
        if(isEmpty){
          state.errorMsg = "Please make sure all values filled in Batch #"+k;
          haveNullBatch = true;
          state.disableCreateButton = false;
          return;
        }
      });
      if(haveNullBatch){
        return;
      }
      await store.create();
      const selectedShop = await store.get('selectedShop');
      if(!selectedShop){
        state.errorMsg = "Shop is not selected";
        state.disableCreateButton = false;
        return;
      }
      try {
        const productExist = await db
          .collection("shops")
          .doc(selectedShop)
          .collection("products")
          .doc(state.sku).get()
        if(productExist.exists || productExist.data() != null){
          state.errorMsg = "Product with this SKU already exists";
          state.disableCreateButton = false;
          return;
        }
        await db
          .collection("shops")
          .doc(selectedShop)
          .collection("products")
          .doc(state.sku)
          .set({
            createdAt: new Date().getTime(),
            lastUpdatedAt: new Date().getTime(),
            name: state.name,
            sku: state.sku,
            batches:state.batches
          });
        router.push("/products");
      } catch (error) {
        state.errorMsg = error.message;
        state.disableCreateButton = false;
      }
    };
    const onSkuInput = (sku: any)=>{
      state.sku = sku.replaceAll(/^\s+|\s+$/g,'').replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    }
    const addBatch = ()=>{
      state.batches.push({
        purchaseDate:"",
        purchasePrice: 0,
        stockQuantity: 0,
        measurementUnit:"piece",
        sellingPrice:0
      });
    }
    const deleteBatch = (id: any)=>{
      if(confirm("Are you sure?")){
        const batches = state.batches
        batches.splice(id, 1)
        state.batches = batches
        console.log(state.batches)
      }
    }
    return { ...toRefs(state), openScanner, onSkuInput, addBatch, deleteBatch, createNewProduct };
  },
};
</script>

<style scoped></style>
