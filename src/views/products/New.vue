<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>New Shop</ion-title>
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
                createNewProduct(
                  name,
                  price,
                  sku,
                  salePrice,
                  stockQuantity,
                  onSale,
                  inventoryEnabled,
                  measurementUnit
                )
              "
            >
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
                      <ion-label position="floating">Price*</ion-label>
                      <ion-input
                        v-model="price"
                        @input="price = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">SKU*</ion-label>
                      <ion-input
                        v-model="sku"
                        @input="sku = $event.target.value"
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
                        v-model="salePrice"
                        @input="salePrice = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                  <ion-col>
                    <ion-item>
                      <ion-label>On Sale</ion-label>
                      <ion-toggle
                        value="true"
                        v-model="onSale"
                        @input="onSale = $event.target.value"
                      />
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Quantity</ion-label>
                      <ion-input
                        v-model="stockQuantity"
                        @input="stockQuantity = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                  <ion-col>
                    <ion-item>
                      <ion-label>Measurement Unit</ion-label>
                      <ion-select v-model="measurementUnit" @change="measurementUnit = $event.target.value" ok-text="Okay" cancel-text="Dismiss">
                        <ion-select-option value="piece">Piece</ion-select-option>
                        <ion-select-option value="liter">Liter</ion-select-option>
                        <ion-select-option value="ml">Ml</ion-select-option>
                      </ion-select>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-button expand="block" type="submit">Create</ion-button>
            </form>
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
import { IonContent, IonPage } from "@ionic/vue";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";
import { auth, db } from "@/main";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";

export default {
  name: "NewProduct",
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    const state = reactive({
      name: "",
      price: "",
      sku: "",
      salePrice: "",
      stockQuantity: "",
      onSale: "",
      inventoryEnabled: "",
      errorMsg: "",
      measurementUnit: "",
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
    const createNewProduct = async (
      name: string,
      price: string,
      sku: string,
      salePrice: string,
      stockQuantity: string,
      onSale: boolean,
      inventoryEnabled: boolean,
      measurementUnit: string
    ) => {
      try {
        await db
          .collection("shops")
          .doc(localStorage.selectedShop)
          .collection("products")
          .doc(sku)
          .set({
            createdAt: new Date().getTime(),
            lastUpdatedAt: new Date().getTime(),
            expiryAt: null,
            formatedExpiry: null,
            inventoryEnable: inventoryEnabled,
            name: name,
            onSale: onSale,
            price: parseInt(price),
            salePrice: parseInt(salePrice),
            sku: sku,
            stockQuantity: parseInt(stockQuantity),
            weight: null,
            measurementUnit:measurementUnit
          });
        router.push("/products");
      } catch (error) {
        state.errorMsg = error.message;
      }
    };
    return { ...toRefs(state), openScanner, createNewProduct };
  },
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
</style>
