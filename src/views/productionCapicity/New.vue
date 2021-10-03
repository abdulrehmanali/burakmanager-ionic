<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>New Production Product</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-row>
              <ion-col>
                <ion-card-title>Products Required in Production</ion-card-title>
              </ion-col>
              <ion-col>
                <ion-button @click="openSelectProductModal"
                  >Select Product</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-card-header>
          <ion-card-content>
            <ion-item
              v-for="(product, key) in selectedProducts"
              :key="product.sku"
              :value="product.sku"
            >
              <ion-label>
                <h2>{{ product.name }}</h2>
                <p>
                  {{ product.stockQuantity }}
                  {{ product.stockQmeasurementUnituantity }}
                </p>
              </ion-label>
              <ion-icon
                slot="end"
                :icon="trash"
                @click="deleteSelectedProduct(key)"
              ></ion-icon>
            </ion-item>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="selectedProducts.length">
          <ion-card-header>
            <ion-row>
              <ion-card-title
                >Products Quantity Required in Production</ion-card-title
              >
            </ion-row>
          </ion-card-header>
          <ion-card-content>
            <ion-note
              >Please select the quantity required to generate one
              product</ion-note
            >
            <ion-item
              v-for="(product, key) in selectedProducts"
              :key="product.sku"
              :value="product.sku"
            >
            <ion-grid>
              <ion-row>
                <ion-col>
                  <h2>{{ product.name }}</h2>
                </ion-col>
                <ion-col>
                  <ion-input
                    type="number"
                    placeholder="Quantity"
                    :max="selectedProducts[key].stockQuantity"
                    min="0"
                    @change="
                      selectedProducts[key].quantityRequiredForOneProduct =
                        $event.target.value
                    "
                    style="width:100%"
                  ></ion-input>
                </ion-col>
                <ion-col>
                  <ion-label>{{ product.measurementUnit }}</ion-label>
                </ion-col>
              </ion-row>
            </ion-grid>
            </ion-item>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="selectedProducts.length">
          <ion-card-header>
            <ion-row>
              <ion-card-title>Calculations</ion-card-title>
            </ion-row>
          </ion-card-header>
          <ion-card-content>
            <ion-button @click="calculateProducts">Calculate</ion-button>
            <ion-note>Max Product generation capicity {{maxProducibleProducts}}</ion-note>
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
import { IonContent, IonPage, modalController } from "@ionic/vue";
import { auth, db } from "@/main";
import { reactive, toRefs } from "@vue/reactivity";
import SelectProductModelVue from "../components/models/SelectProductModel.vue";
import { emitter } from "../../services/emitter";
import { trash } from "ionicons/icons";

let selectProductModelVue: any;
export default {
  name: "NewProductionProduct",
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    const state = reactive({
      selectedProducts: [] as any,
      maxProducibleProducts: 0 as any,
      lastCalculatedAt: 0,
    });
    emitter.on("select_product_event", async (product: any) => {
      state.selectedProducts.push(product);
      await selectProductModelVue.dismiss();
    });
    const openSelectProductModal = async () => {
      selectProductModelVue = await modalController.create({
        component: SelectProductModelVue,
        cssClass: "my-custom-class",
        componentProps: {
          title: "New Title",
        },
      });
      return selectProductModelVue.present();
    };
    const deleteSelectedProduct = (id: any) => {
      const sp = state.selectedProducts;
      sp.splice(id, 1);
      state.selectedProducts = sp;
      console.log(state.selectedProducts);
      return true;
    };
    const calculateProducts = () => {
      const maxQuantity = [];
      for (let i = 0; i < state.selectedProducts.length; i++) {
        const selectedProduct = state.selectedProducts[i];
        maxQuantity.push(selectedProduct.stockQuantity / selectedProduct.quantityRequiredForOneProduct)
      }
      state.maxProducibleProducts = Math.round(Math.min(...maxQuantity));
    }
    return {
      ...toRefs(state),
      openSelectProductModal,
      trash,
      deleteSelectedProduct,
      calculateProducts
    };
  },
};
</script>

<style scoped>
/* #container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
} */
</style>
