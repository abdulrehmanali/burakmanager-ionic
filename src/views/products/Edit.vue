<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button />
        </ion-buttons>
        <ion-title>Edit Product</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title></ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form
              @submit.prevent="
                saveProduct(
                  product.name,
                  product.price,
                  product.sku,
                  product.salePrice,
                  product.stockQuantity,
                  product.onSale,
                  product.inventoryEnable,
                  product.measurementUnit
                )
              "
            >
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Name*</ion-label>
                      <ion-input
                        v-model="product.name"
                        :value="product.name"
                        @input="product.name = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Price*</ion-label>
                      <ion-input
                        v-model="product.price"
                        :value="product.price"
                        @input="product.price = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">SKU*</ion-label>
                      <ion-input
                        v-model="product.sku"
                        :value="product.sku"
                        @input="product.sku = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                  <ion-col>
                    <ion-button color="primary" v-on:click="openScanner()"
                      >Scan</ion-button
                    >
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Sale Price*</ion-label>
                      <ion-input
                        v-model="product.salePrice"
                        :value="product.salePrice"
                        @input="product.salePrice = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                  <ion-col>
                    <ion-item>
                      <ion-label>On Sale</ion-label>
                      <ion-toggle
                        :checked="product.onSale"
                        v-model="product.onSale"
                        @input="product.onSale = $event.target.value"
                      />
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Quantity</ion-label>
                      <ion-input
                        v-model="product.stockQuantity"
                        :value="product.stockQuantity"
                        @input="product.stockQuantity = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                  <ion-col>
                    <ion-item>
                      <ion-label>Measurement Unit</ion-label>
                      <ion-select v-model="product.measurementUnit" @change="product.measurementUnit = $event.target.value" :value="product.measurementUnit" ok-text="Okay" cancel-text="Dismiss">
                        <ion-select-option :value="am.key" v-for="am in availableMeasurementUnits" :key="am.key">{{am.name}}</ion-select-option>
                      </ion-select>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-button expand="block" type="submit">Save</ion-button>
            </form>
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
import { useRoute } from "vue-router";
import { Storage } from '@ionic/storage';

export default {
  name: "EditProduct",
  components: {
    IonContent,
    IonPage,
    IonBackButton,
    IonSelect
  },
  setup() {
    const store = new Storage();
    const route = useRoute();
    const { sku } = route.params;
    
    const state = reactive({
      product: {
        sku: "",
      },
      errorMsg: "",
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

    const getProduct = async (sku: any) => {
      try {
        await store.create();
        const selectedShop = await store.get('selectedShop');
        const product = await db
          .collection("shops")
          .doc(selectedShop)
          .collection("products")
          .doc(sku)
          .get();
        state.product = product.data() as any;
      } catch (error) {
        state.errorMsg = error.message;
      }
    };

    const saveProduct = async (
      name: string,
      price: string,
      sku: string,
      salePrice: string,
      stockQuantity: string,
      onSale = false,
      inventoryEnabled = false,
      measurementUnit: string
    ) => {
      try {
        const selectedShop = await store.get('selectedShop');
        await db
          .collection("shops")
          .doc(selectedShop)
          .collection("products")
          .doc(sku)
          .update({
            lastUpdatedAt: new Date().getTime(),
            inventoryEnable: inventoryEnabled,
            name: name,
            onSale: onSale,
            price: parseInt(price),
            salePrice: parseInt(salePrice),
            sku: sku,
            stockQuantity: parseInt(stockQuantity),
            measurementUnit: measurementUnit
          });
        router.back();
      } catch (error) {
        state.errorMsg = error.message;
      }
    };
    getProduct(sku.toString());
    return { ...toRefs(state), openScanner, saveProduct, router };
  },
};
</script>
<style scoped></style>