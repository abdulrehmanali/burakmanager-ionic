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
    <ion-content :fullscreen="true" :style="scanActive?'background:#00000000':''">
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
                      :value="name"
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
                      @input="onSkuInput($event.target.value)"
                      :value="sku"
                    ></ion-input>
                  </ion-item>
                </ion-col>
                <ion-col>
                  <ion-button
                    color="primary"
                    v-on:click="openScanner()"
                    class="ion-float-end"
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
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Batch Number*: </ion-label>
                  <ion-input
                    v-model="batch.batch_id"
                    type="text"
                    :value="batch.batch_id"
                    @input="batch.batch_id = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Purchase Date*: </ion-label>
                  <ion-input
                    v-model="batch.purchased_at"
                    type="date"
                    :value="batch.purchased_at"
                    @input="batch.purchased_at = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Expiry Date: </ion-label>
                  <ion-input
                    v-model="batch.expire_at"
                    type="date"
                    :value="batch.expire_at"
                    @input="batch.expire_at = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Purchase Price*: </ion-label>
                  <ion-input
                    v-model="batch.purchasing_price"
                    type="number"
                    :value="batch.purchasing_price"
                    @input="batch.purchasing_price = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Selling Price*: </ion-label>
                  <ion-input
                    v-model="batch.selling_price"
                    :value="batch.selling_price"
                    @input="batch.selling_price = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Quantity*: </ion-label>
                  <ion-input
                    v-model="batch.quantity"
                    :value="batch.quantity"
                    @input="batch.quantity = $event.target.value"
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Measurement Unit*: </ion-label>
                  <ion-select
                    v-model="batch.measurement_unit"
                    @change="batch.measurement_unit = $event.target.value"
                    :value="batch.measurement_unit"
                    ok-text="Okay"
                    cancel-text="Dismiss"
                  >
                    <ion-select-option
                      :value="am.key"
                      v-for="am in availableMeasurementUnits"
                      :key="am.key"
                      >{{ am.name }}</ion-select-option
                    >
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
                    <ion-select-option value="active" selected
                      >Active</ion-select-option
                    >
                    <ion-select-option value="in-production" selected
                      >In Production</ion-select-option
                    >
                    <ion-select-option value="in-quarantine" selected
                      >In Quarantine</ion-select-option
                    >
                    <ion-select-option value="on-hold" selected
                      >On Hold</ion-select-option
                    >
                    <ion-select-option value="expired" selected
                      >Expired</ion-select-option
                    >
                    <ion-select-option value="out-of-stock" selected
                      >Out Of Stock</ion-select-option
                    >
                  </ion-select>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-button
                    @click="deleteBatch(id)"
                    class="ion-float-end"
                    color="danger"
                    >Delete</ion-button
                  >
                </ion-item>
              </ion-col>
            </ion-row>
          </ion-card-content>
        </ion-card>
        <ion-button
          expand="block"
          type="submit"
          @click="createNewProduct()"
          :disabled="disableCreateButton"
          >Save</ion-button
        >
        <ion-card v-if="errorMsg && (errorMsg instanceof String)">
          <ion-card-content class="error-message">
            {{ errorMsg }}
          </ion-card-content>
        </ion-card>
        <ion-card v-if="errorMsg && (typeof errorMsg === 'object')">
          <ion-card-content class="error-message" v-for="msg in errorMsg" :key="msg[0]">
            {{ msg[0] }}
          </ion-card-content>
        </ion-card>
      </div>
      <ion-row class="scan-button" v-if="scanActive">
        <ion-col class="ion-no-padding">
          <ion-button expand="full" :click="stopScanner()">Stop</ion-button>
        </ion-col>
      </ion-row>
      <div class="scan-box" v-if="scanActive"></div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import {
  IonContent,
  IonPage,
  IonBackButton,
  IonSelect,
  onIonViewWillLeave,
} from "@ionic/vue";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { createProduct } from "@/services/products.services";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

export default {
  name: "NewProduct",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonSelect,
  },
  setup() {
    const stateDefault = {
      name: "",
      sku: "",
      errorMsg: "",
      batches: [] as any,
      disableCreateButton: false,
      scanActive: false,
      availableMeasurementUnits: [
        { key: "centigram", name: "Centigram (cg)" },
        { key: "centilitre", name: "Centilitre (cL)" },
        { key: "carton", name: "Carton" },
        { key: "decagram", name: "Decagram (dag)" },
        { key: "decalitre", name: "Decalitre (daL)" },
        { key: "decigram", name: "Decigram (dg)" },
        { key: "decilitre", name: "Decilitre (dL)" },
        { key: "gram", name: "Gram (g)" },
        { key: "hectogram", name: "Hectogram (hg)" },
        { key: "hectolitre", name: "Hectolitre (hL)" },
        { key: "kilo", name: "Kilo (k)" },
        { key: "kilogram", name: "Kilogram (kg)" },
        { key: "kilolitre", name: "Kilolitre (kL)" },
        { key: "litre", name: "Litre (L)" },
        { key: "milligram", name: "Milligram (mg)" },
        { key: "millilitre", name: "Millilitre (mL)" },
        { key: "piece", name: "Piece(s)" },
        { key: "packet", name: "Packet" },
        { key: "tonne", name: "Tonne (t)" },
        { key: "ounce", name: "Ounce (OZ)" },
      ],
    }
    const state = reactive({...stateDefault});
    const checkPermission = () => {
      return new Promise((resolve, reject) => {
        BarcodeScanner.checkPermission({ force: true }).then(status=>{
          if (status.granted) {
            resolve(true);
          } else if (status.denied) {
            BarcodeScanner.openAppSettings();
            resolve(false);
          }
        })
      });
    };
    const stopScanner = () => {
      BarcodeScanner.stopScan();
      state.scanActive = false;
    };
    const startScanner = async () => {
      const allowed = await checkPermission();

      if (allowed) {
        state.scanActive = true;
        BarcodeScanner.hideBackground();

        const result = await BarcodeScanner.startScan();

        if (result.hasContent) {
          state.scanActive = false;
          state.sku = result.content as any;
          alert(result.content); //The QR content will come out here
          //Handle the data as your heart desires here
          stopScanner();
        } else {
          alert("NO DATA FOUND!");
        }
      } else {
        alert("NOT ALLOWED!");
      }
    };

    onIonViewWillLeave(() => {
      state.name = ''
      state.sku = ''
      state.errorMsg = ''
      state.batches = [] as any
      state.disableCreateButton = false
      state.scanActive = false
      stopScanner();
    });
    const openScanner = async () => {
      startScanner();
    };
    const createNewProduct = async () => {
      state.errorMsg = "";
      state.disableCreateButton = true;
      state.sku = state.sku
        .replaceAll(/^\s+|\s+$/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
      if (!state.name) {
        state.errorMsg = "Product Name is required";
        state.disableCreateButton = false;
        return;
      }
      if (!state.sku) {
        state.errorMsg = "Product SKU is required";
        state.disableCreateButton = false;
        return;
      }
      if (!state.batches.length) {
        state.errorMsg = "Atleast one Batch is required";
        state.disableCreateButton = false;
        return;
      }
      let haveNullBatch = false;
      state.batches.forEach((element: any, k: any) => {
        const isEmpty = Object.values(element).every(
          (x) => x == null || x == ""
        );
        if (isEmpty) {
          state.errorMsg = "Please make sure all values filled in Batch #" + k;
          haveNullBatch = true;
          state.disableCreateButton = false;
          return;
        }
      });
      if (haveNullBatch) {
        return;
      }
      createProduct(state.name, state.sku, state.batches)
        .then((res: any) => {
          state.disableCreateButton = false;
          if (res.data.error) {
            state.errorMsg = res.response.data.error;
            return;
          }
          router.push("/products");
        })
        .catch((res: any) => {
          state.disableCreateButton = false;
          if(!res.response || !res.response.data){
            state.errorMsg = "Error please try again";
            return;
          }
          if(res.response.data.errors){
            state.errorMsg = res.response.data.errors;
            return
          }
          state.errorMsg = res.response.data.error;
        });
    };
    const onSkuInput = (sku: any) => {
      state.sku = sku
        .replaceAll(/^\s+|\s+$/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
    };
    const addBatch = () => {
      state.batches.push({
        'batch_id': state.batches.length,
        'purchased_at': "",
        'purchasing_price': 0,
        quantity: 0,
        'measurement_unit': "",
        'selling_price': 0,
      });
    };
    const deleteBatch = (id: any) => {
      if (confirm("Are you sure?")) {
        const batches = state.batches;
        batches.splice(id, 1);
        state.batches = batches;
        console.log(state.batches);
      }
    };
    return {
      ...toRefs(state),
      openScanner,
      onSkuInput,
      addBatch,
      deleteBatch,
      createNewProduct,
      stopScanner
    };
  },
};
</script>

<style scoped>
.scan-box {
  border: 2px solid #fff;
  box-shadow: 0 0 0 100vmax rgb(0, 0, 0, 0.5);
  content: "";
  display: block;
  left: 50%;
  height: 300px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
}
</style>
