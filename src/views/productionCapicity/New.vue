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
            <ion-row class="ion-align-items-start">
              <ion-col>
                <ion-card-title style="margin: 10px 0px"
                  >Products Required in Production</ion-card-title
                >
              </ion-col>
              <ion-col>
                <ion-button @click="openSelectProductModal" class="ion-float-end"
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
                  {{ product.stockQuantity }} {{ product.measurementUnit }}
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
            <ion-card-title>Products Quantity Required in Production</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-note
              >Please select the quantity required to generate one product</ion-note
            >
            <ion-list>
              <ion-item>
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-label>Item</ion-label>
                    </ion-col>
                    <ion-col>
                      <ion-label>Quantity</ion-label>
                    </ion-col>
                    <ion-col>
                      <ion-label>Unit</ion-label>
                    </ion-col>
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
                    <ion-col>
                      <ion-label>{{ product.name }}</ion-label>
                      <p>
                        {{ product.stockQuantity }}
                        {{ product.measurementUnit }} available
                      </p>
                    </ion-col>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="number"
                          placeholder="Quantity"
                          :max="selectedProducts[key].stockQuantity"
                          min="0"
                          @keyup="forOnePieceQuantityUpdate(key, $event.target.value)"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                    <ion-col>
                      <ion-label>{{ product.measurementUnit }}</ion-label>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-item>
              <ion-item>
                <ion-label> Max Product Generation Capicity </ion-label>
                <ion-label slot="end">{{ maxProducibleProducts }}</ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="selectedProducts.length">
          <ion-card-header>
            <ion-card-title>Custom Require Quantity</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label>Required Quantity: </ion-label>
                <ion-input
                  type="number"
                  v-model="customQuantity"
                  :value="customQuantity"
                  @keyup="customQuantity = $event.target.value"
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-label>Item</ion-label>
                    </ion-col>
                    <ion-col>
                      <ion-label>Quantity In Stock</ion-label>
                    </ion-col>
                    <ion-col>
                      <ion-label>Additional Required</ion-label>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-item>
              <ion-item
                v-for="product in selectedProducts"
                :key="product.sku"
                :value="product.sku"
              >
                <ion-grid>
                  <ion-row>
                    <ion-col>
                      <ion-label>{{ product.name }}</ion-label>
                    </ion-col>
                    <ion-col>
                      <ion-label
                        >{{ product.stockQuantity }}
                        {{ product.measurementUnit }}</ion-label
                      >
                    </ion-col>
                    <ion-col>
                      <ion-label
                        >{{ calculateAdditionalRequired(product) }}
                        {{ product.measurementUnit }}</ion-label
                      >
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-item>
            </ion-list>
          </ion-card-content>
        </ion-card>
        <ion-card v-if="selectedProducts.length">
          <ion-card-header>
            <ion-card-title>Actions</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label>Name</ion-label>
                <ion-input type="text" placeholder="Name of product"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label>Price</ion-label>
                <ion-input type="text" placeholder="Price of one product"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label>SKU</ion-label>
                <ion-input type="text" placeholder="SKU"></ion-input>
              </ion-item>
            </ion-list>
            <ion-button v-on:click="crateNewProductionCapicity()">
              Save
            </ion-button>
            <p v-if="errorMsg" class="error-message">
            {{ errorMsg }}
          </p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage, modalController } from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import SelectProductModelVue from "../components/models/SelectProductModel.vue";
import { emitter } from "@/services/emitter";
import { trash } from "ionicons/icons";
import { Storage } from '@ionic/storage';
import { db } from '@/main';

let selectProductModelVue: any;
export default {
  name: "NewProductionProduct",
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    const store = new Storage();
    const state = reactive({
      selectedProducts: [] as any,
      maxProducibleProducts: 0 as any,
      lastCalculatedAt: 0,
      customQuantity: 0,
      newProductName:"",
      newProductPrice:0,
      newProductSku:0,
      errorMsg: ""
    });
    emitter.on("select_product_event", async (ob: any) => {
      state.selectedProducts.push({
        name: ob.product.name,
        sku: ob.product.sku,
        sellingPrice: ob.product.batches[ob.batchId].sellingPrice,
        purchasePrice: ob.product.batches[ob.batchId].purchasePrice,
        measurementUnit: ob.product.batches[ob.batchId].measurementUnit,
        stockQuantity: ob.product.batches[ob.batchId].stockQuantity,
        createdAt: ob.product.createdAt,
        lastUpdatedAt: ob.product.lastUpdatedAt
      });
      await selectProductModelVue.dismiss();
    });
    emitter.on("close_product_model", async () => {
      if (selectProductModelVue) {
        await selectProductModelVue.dismiss();
      }
    });
    const openSelectProductModal = async () => {
      selectProductModelVue = await modalController.create({
        component: SelectProductModelVue,
      });
      return selectProductModelVue.present();
    };
    const deleteSelectedProduct = (id: any) => {
      const sp = state.selectedProducts;
      sp.splice(id, 1);
      state.selectedProducts = sp;
      return true;
    };
    const calculateProducts = () => {
      const maxQuantity = [];
      for (let i = 0; i < state.selectedProducts.length; i++) {
        const selectedProduct = state.selectedProducts[i];
        maxQuantity.push(
          selectedProduct.stockQuantity / selectedProduct.quantityRequiredForOneProduct
        );
      }
      state.maxProducibleProducts = Math.round(Math.min(...maxQuantity));
    };
    const forOnePieceQuantityUpdate = (key: number, quantity: any) => {
      state.selectedProducts[key].quantityRequiredForOneProduct = quantity;
      calculateProducts();
    };
    const calculateAdditionalRequired = (product: any) => {
      let additionalRequired = 0;
      const customQuantity = state.customQuantity * product.quantityRequiredForOneProduct;
      if (customQuantity > product.stockQuantity) {
        additionalRequired = customQuantity - product.stockQuantity;
      }
      return additionalRequired;
    };
    const crateNewProductionCapicity = async () => {
      try {
        if(state.selectedProducts.length == 0 || !state.newProductName || !state.newProductPrice || !state.newProductSku) {
          state.errorMsg = 'Please make sure you have selected. And You have enter Prodduct Name, SKU and Price';
          return;
        }
        await store.create();
        const selectedShop = await store.get('selectedShop');
        if(!selectedShop){
          new Error('No Shop Seleted.');
          return;
        }
        await db
          .collection("shops")
          .doc(selectedShop)
          .collection("productionCapicity")
          .add({
            createdAt: new Date().getTime(),
            lastUpdatedAt: new Date().getTime(),
            selectedProducts: state.selectedProducts,
            maxProducibleProducts: state.maxProducibleProducts,
            lastCalculatedAt: state.lastCalculatedAt,
            customQuantity: state.customQuantity,
            newProductName: state.newProductName,
            newProductPrice: state.newProductPrice,
            newProductSku: state.newProductSku,
          });
      } catch (error) {
        state.errorMsg = error.message;
      }
    };
    return {
      ...toRefs(state),
      openSelectProductModal,
      trash,  
      deleteSelectedProduct,
      calculateProducts,
      forOnePieceQuantityUpdate,
      calculateAdditionalRequired,
      crateNewProductionCapicity
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
.products-row {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
