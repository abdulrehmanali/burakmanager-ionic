<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/production-products" />
        </ion-buttons>
        <ion-title>Edit Production Product</ion-title>
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
                <ion-button
                  @click="openSelectProductModal"
                  class="ion-float-end"
                  >Select Product</ion-button
                >
              </ion-col>
            </ion-row>
          </ion-card-header>
          <ion-card-content>
            <ion-item
              v-for="(product, key) in selectedProducts"
              :key="key"
              :value="key"
            >
              <ion-label>
                <h2>{{ product.product.name }}</h2>
                <p>{{ product.product.quantity }} {{ product.product.measurement_unit }}</p>
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
            <ion-card-title
              >Products Quantity Required in Production</ion-card-title
            >
          </ion-card-header>
          <ion-card-content>
            <ion-note
              >Please select the quantity required to generate one
              product</ion-note
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
                :key="product.product.sku"
                :value="product.product.sku"
              >
                <ion-grid>
                  <ion-row class="products-row">
                    <ion-col>
                      <ion-label>{{ product.product.name }}</ion-label>
                      <p>
                        {{ product.product.quantity }}
                        {{ product.product.measurement_unit }} available
                      </p>
                    </ion-col>
                    <ion-col>
                      <ion-item>
                        <ion-input
                          type="number"
                          placeholder="Quantity"
                          :max="selectedProducts[key].product.quantity"
                          :value="selectedProducts[key].one_product_quantity"
                          min="0"
                          @keyup="
                            forOnePieceQuantityUpdate(key, $event.target.value)
                          "
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                    <ion-col>
                      <ion-label>{{ product.product.measurement_unit }}</ion-label>
                    </ion-col>
                  </ion-row>
                </ion-grid>
              </ion-item>
              <ion-item>
                <ion-label> Max Product Generation Capicity </ion-label>
                <ion-label slot="end">{{ maxProducibleProducts }}</ion-label>
              </ion-item>
              <ion-item>
                <ion-label> Manufacturing Cost Of Single Product<br><small>(Calculated only based on raw material)</small> </ion-label>
                <ion-label slot="end">{{ getManufacturingCost() }}</ion-label>
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
                      <ion-label>{{ product.product.name }}</ion-label>
                    </ion-col>
                    <ion-col>
                      <ion-label
                        >{{ product.product.quantity }}
                        {{ product.product.measurement_unit }}</ion-label
                      >
                    </ion-col>
                    <ion-col>
                      <ion-label
                        >{{ calculateAdditionalRequired(product) }}
                        {{ product.product.measurement_unit }}</ion-label
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
                <ion-input
                  type="text"
                  placeholder="Name of product"
                  :value="newProductName"
                  v-on:change="
                    (e) => {
                      newProductName = e.target.value;
                    }
                  "
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label>Price</ion-label>
                <ion-input
                  type="text"
                  placeholder="Price of one product"
                  :value="newProductPrice"
                  v-on:change="
                    (e) => {
                      newProductPrice = e.target.value;
                    }
                  "
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label>SKU</ion-label>
                <ion-input
                  type="text"
                  placeholder="SKU"
                  :value="newProductSku"
                  v-on:change="
                    (e) => {
                      newProductSku = e.target.value;
                    }
                  "
                ></ion-input>
              </ion-item>
            </ion-list>
            <ion-button v-on:click="crateNewProductionCapicity()">
              Save
            </ion-button>
            <ion-button v-on:click="getProductionCapicityPdf()">
              Get PDF
            </ion-button>
            <ion-button v-on:click="generateProductionProduct()" v-if="maxProducibleProducts != 0">
              Generate Product
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
import { IonContent, IonPage, modalController, IonBackButton, onIonViewWillEnter } from "@ionic/vue";
import { reactive, toRefs } from "@vue/reactivity";
import SelectProductModelVue from "../components/models/SelectProductModel.vue";
import { emitter } from "@/services/emitter";
import { trash } from "ionicons/icons";
import { GenerateProduct, getProductionProduct, getProductionProductPdf, updateProductionProduct } from "@/services/productionProducts.services";
import router from "@/router";
import { useRoute } from 'vue-router';

let selectProductModelVue: any;
export default {
  name: "EditProductionProduct",
  components: {
    IonContent,
    IonPage,
    IonBackButton
  },
  setup() {
    const route = useRoute();
    const { id } = route.params;
    const state = reactive({
      selectedProducts: [] as any,
      maxProducibleProducts: 0 as any,
      lastCalculatedAt: 0,
      customQuantity: 0,
      newProductName: "",
      newProductPrice: 0,
      newProductSku: 0,
      errorMsg: "",
    });
    emitter.on("select_product_event", async (ob: any) => {
      state.selectedProducts.push({
        'product_id': ob.id,
        product:{
        'product_id': ob.id,
        name: ob.name,
        sku: ob.sku,
        'selling_price': ob.batches[ob.batchId].selling_price,
        'purchasing_price': ob.batches[ob.batchId].purchasing_price,
        'measurement_unit': ob.batches[ob.batchId].measurement_unit,
        quantity: ob.batches[ob.batchId].quantity,
      }});
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
          selectedProduct.product.quantity / selectedProduct["one_product_quantity"]
        );
      }
      state.maxProducibleProducts = Math.round(Math.min(...maxQuantity));
    };
    const forOnePieceQuantityUpdate = (key: number, quantity: any) => {
      state.selectedProducts[key]["one_product_quantity"] = quantity;
      calculateProducts();
    };
    const calculateAdditionalRequired = (product: any) => {
      let additionalRequired = 0;
      const customQuantity =
        state.customQuantity * parseFloat(product["one_product_quantity"]);
      if (customQuantity > product.product.quantity) {
        additionalRequired = customQuantity - product.product.quantity;
      }
      return additionalRequired;
    };
    const getProducitonProductFromServer = async () => {
      try {
        const productionCapicity = await getProductionProduct(id);
        state.selectedProducts = productionCapicity.data.production_product.products
        for (let i = 0; i < state.selectedProducts.length; i++) {
          const sp = state.selectedProducts[i];
          sp.quantity = 0
          sp.measurementUnit = null
          sp.product.batches.forEach((b: any) => {
            if (b.status == 'active') {
              sp.quantity += parseFloat(b.quantity)
              sp.measurementUnit = b.measurement_unit
            }
          });
          state.selectedProducts[i]['product'].quantity = sp.quantity
          state.selectedProducts[i]['product']['measurement_unit'] = sp.measurementUnit
          
        }
        state.newProductName = productionCapicity.data.production_product.name
        state.newProductPrice = productionCapicity.data.production_product.price
        state.newProductSku = productionCapicity.data.production_product.sku
        calculateProducts();
      } catch (error: any) {
        state.errorMsg = error.message;
      }
    };
    const crateNewProductionCapicity = async () => {
      try {
        if (
          state.selectedProducts.length == 0 ||
          !state.newProductName ||
          !state.newProductPrice ||
          !state.newProductSku
        ) {
          state.errorMsg =
            "Please make sure you have selected. And You have enter Prodduct Name, SKU and Price";
          return;
        }
        await updateProductionProduct(
          id,
          state.newProductName,
          state.newProductPrice.toString(),
          state.newProductSku.toString(),
          state.selectedProducts,
        );
        router.push("/production-products");
      } catch (error: any) {
        state.errorMsg = error.message;
      }
    };
    onIonViewWillEnter(() => {
      getProducitonProductFromServer();
    });
    const getProductionCapicityPdf = ()=>{
      getProductionProductPdf(id).then(res=>{
        const blob = new Blob([res.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(blob)
        window.open(url)
      })
    }
    const generateProductionProduct = () => {
      const requiredQuantity = prompt("Please enter the Required Quantity")
      if (requiredQuantity == null) {
        return;
      }
      if (requiredQuantity > state.maxProducibleProducts) {
        alert('You dont have enough stock to generate this quantity.')
        return;
      }
      GenerateProduct(id, requiredQuantity).then(res=>{
        if (!res.data.success) {
          alert('Error');
          return;
        }
        alert('Generate');
        router.push("/production-products");
      })
    }
    const getManufacturingCost = ()=>{
      // let totalPrice = 0;
      //   for (let i = 0; i < state.selectedProducts.length; i++) {
      //     const sp = state.selectedProducts[i];
      //     console.log(sp)
      //     let bPrice = 0;
      //     let bTotal = 0;
      //     sp.product.batches.forEach((b: any) => {
      //       if (b.status == 'active') {
      //         bPrice += (parseFloat(b.selling_price))
      //         bTotal++
      //       }
      //     });
      //     totalPrice += sp.one_product_quantity / (bPrice / bTotal)
      //   }
      //   totalPrice = totalPrice/state.selectedProducts.length
      //   return totalPrice
      return 'N/A'
    }
    return {
      ...toRefs(state),
      openSelectProductModal,
      trash,
      deleteSelectedProduct,
      calculateProducts,
      forOnePieceQuantityUpdate,
      calculateAdditionalRequired,
      crateNewProductionCapicity,
      getProductionCapicityPdf,
      generateProductionProduct,
      getManufacturingCost
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
