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
                      @input="onSkuInput($event.target.value)"
                      :value="product.sku"
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
            <ion-row v-for="(batch, id) in product.batches" :key="batch.id" style="border:1px solid black">
              <ion-col size="12">
                <ion-item>
                  <ion-label>Batch Number: {{batch.id}}</ion-label>
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
                  <ion-label>Purchase From: </ion-label>
                  <ion-input
                    type="text"
                    :value="batch.purchase_from?.company_name"
                    @click="openSelectProductModel(id)"
                    readonly
                  ></ion-input>
                </ion-item>
              </ion-col>
              <ion-col size="12" size-sm="6">
                <ion-item>
                  <ion-label>Delivery Date: </ion-label>
                  <ion-input
                    v-model="batch.delivery_at"
                    type="date"
                    :value="batch.delivery_at"
                    @input="batch.delivery_at = $event.target.value"
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
                    v-model="batch.status"
                    :value="batch.status"
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
        <ion-card
          v-if="
            errorMsg &&
            (typeof errorMsg === 'string' || errorMsg instanceof String)
          "
        >
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
        <ion-button
          expand="block"
          type="submit"
          @click="saveProduct()"
          :disabled="disableSaveButton"
          >Save</ion-button
        >
        <ion-card v-if="productionProducts">
          <ion-card-header>
            <ion-card-title style="margin: 10px 0px"
              >Ingredients</ion-card-title
            >
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item
                v-for="product in productionProducts"
                :key="product.sku"
                :value="product.sku"
              >
                <ion-grid>
                  <ion-row class="products-row">
                    <ion-col>
                      <ion-label>{{ product.name }}</ion-label>
                      <p>
                        {{ product.quantity }}
                        {{ product.measurement_unit }} available
                      </p>
                    </ion-col>
                    <ion-col>
                      <ion-label>Required Quantity</ion-label>
                      <p>{{ product.one_product_quantity }} {{ product.measurement_unit }}</p>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-item>
            </ion-list>
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
  IonSelect,
  onIonViewWillEnter,
modalController,
} from "@ionic/vue";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { getProduct, updateProduct } from "@/services/products.services";
import SelectCustomerMode from "../components/models/SelectCustomerMode.vue";
import { emitter } from "@/services/emitter";

let selectCustomerModelVue: any;
export default {
  name: "EditProduct",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonSelect,
  },
  setup() {
    const route = useRoute();
    const { sku } = route.params;
    const stateDefault = {
      product: {
        id: "",
        sku: "",
      } as any,
      errorMsg: "" as any,
      disableSaveButton: true,
      productionProducts: [] as any,
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
        { key: "lolo", name: "Lolo" },
        { key: "foils", name: "Foils" },
        { key: "sachet_foil", name: "Sachet foil" },
        { key: "label", name: "Label" },
        { key: "outer", name: "Outer" },
      ],
    };
    
    const state = reactive({...stateDefault});
    emitter.on("select_customer_event", async (ob: any) => {
      state.product.batches[ob.batchId]['purchase_from'] = ob;
      await selectCustomerModelVue.dismiss();
    });
    emitter.on("close_customer_model", async () => {
      if (selectCustomerModelVue) {
        await selectCustomerModelVue.dismiss();
      }
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
        const product = await getProduct(sku);
        const productRes = product.data.product;
        state.productionProducts = product.data.productionProducts;
        state.disableSaveButton = false;

        for (let i = 0; i < productRes.batches.length; i++) {
          let purchasedAt = productRes.batches[i].purchased_at;
          if (purchasedAt) {
            purchasedAt = new Date(purchasedAt)
            purchasedAt = purchasedAt.getFullYear() + '-' + ("0"+purchasedAt.getMonth()).slice(-2) + '-' + purchasedAt.getDate()
            productRes.batches[i]['purchased_at'] = purchasedAt;
          }

          let deliveryAt = productRes.batches[i].delivery_at;
          if (deliveryAt) {
            deliveryAt = new Date(deliveryAt)
            deliveryAt = deliveryAt.getFullYear() + '-' + ("0"+deliveryAt.getMonth()).slice(-2) + '-' + deliveryAt.getDate()
            productRes.batches[i]['delivery_at'] = deliveryAt;
          }


          let expireAt = productRes.batches[i].expire_at;
          if (expireAt) {
            expireAt = new Date(expireAt)
            expireAt = expireAt.getFullYear() + '-' + ("0"+expireAt.getMonth()).slice(-2) + '-' + expireAt.getDate()
            productRes.batches[i]['expire_at'] = expireAt;
          }
        }
        state.product = productRes;
        
      } catch (error: any) {
        state.errorMsg = error.message;
      }
    };
    const openSelectProductModel = async (batchId: any) => {
      selectCustomerModelVue = await modalController.create({
        component: SelectCustomerMode,
        componentProps: { 
          batchId: batchId,
        }
      });
      return selectCustomerModelVue.present();
    };
    const saveProduct = async () => {
      if (!state.product.name) {
        state.errorMsg = "Product Name is required";
        return;
      }
      if (!state.product.sku) {
        state.errorMsg = "Product SKU is required";
        return;
      }
      if (!state.product.batches || !state.product.batches.length) {
        state.errorMsg = "Atleast one Batch is required";
        return;
      }
      updateProduct(
        state.product.id,
        state.product.name,
        state.product.sku,
        state.product.batches
      )
        .then((res: any) => {
          state.disableSaveButton = false;
          if (!res.data.success) {
            state.errorMsg = "Error Please Try Again";
            if (res.data.error) {
              state.errorMsg = res.data.error;
            }
            if (res.data.errors) {
              state.errorMsg = res.data.errors;
            }
            return;
          }
          router.push("/products");
        })
        .catch((res: any) => {
          state.disableSaveButton = false;
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
    onIonViewWillEnter(() => {
      getProductFromServer();
    });
    const onSkuInput = (sku: any) => {
      state.product.sku = sku
        .replaceAll(/^\s+|\s+$/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
    };
    const addBatch = () => {
      state.product.batches.push({
        'purchased_at': "",
        'purchasing_price': 0,
        'quantity': 0,
        'measurement_unit': "piece",
        'selling_price': 0,
        'purchase_from': { 'company_name': "" },
      });
    };
    const deleteBatch = (id: any) => {
      if (confirm("Are you sure?")) {
        const batches = state.product.batches;
        batches.splice(id, 1);
        state.product.batches = batches;
      }
    };
    return {
      ...toRefs(state),
      openScanner,
      saveProduct,
      router,
      onSkuInput,
      addBatch,
      deleteBatch,
      openSelectProductModel
    };
  },
};
</script>
<style scoped></style>