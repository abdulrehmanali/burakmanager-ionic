<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/ledger"></ion-back-button>
        </ion-buttons>
        <ion-title>New Entry</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Select Entry Type</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
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
          <ion-card-header>
            <ion-row class="ion-align-items-start">
              <ion-col>
                <ion-card-title style="margin: 10px 0px"
                  >Product's (Optional)</ion-card-title
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
            <ion-list>
              <ion-item v-if="selectedProducts.length">
                <ion-grid class="ion-hide-sm-down">
                  <ion-row>
                    <ion-col size="12" size-sm>
                      <ion-label> Item </ion-label>
                    </ion-col>
                    <ion-col size="12" size-sm>
                      <ion-label> Quantity </ion-label>
                    </ion-col>
                    <ion-col size="12" size-sm>
                      <ion-label> Rate </ion-label>
                    </ion-col>
                    <ion-col size="12" size-sm>
                      <ion-label> Total </ion-label>
                    </ion-col>
                    <ion-col size="12" size-sm> </ion-col>
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
                    <ion-col size="12" size-sm>
                      <ion-label>
                        <h2>{{ product.name }}</h2>
                      </ion-label>
                    </ion-col>
                    <ion-col size="12" size-sm>
                      <ion-item>
                        <ion-label class="ion-hide-sm-up">Quantity</ion-label>
                        <ion-input
                          type="number"
                          v-model="product.selectedQuantity"
                          @keyup="
                            product.selectedQuantity =
                              $event.target.value >= product.stockQuantity
                                ? product.selectedQuantity
                                : $event.target.value
                          "
                          :value="product.selectedQuantity"
                          :maxlength="product.stockQuantity"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-sm>
                      <ion-item>
                        <ion-label class="ion-hide-sm-up">Rate</ion-label>
                        <ion-input
                          type="number"
                          v-model="product.sellingPrice"
                          @keyup="
                            product.sellingPrice =
                              $event.target.value >= product.purchasePrice
                                ? $event.target.value
                                : product.sellingPrice
                          "
                          :value="product.sellingPrice"
                          :minlength="product.purchasePrice"
                        ></ion-input>
                      </ion-item>
                    </ion-col>
                    <ion-col size="12" size-sm>
                      <ion-label>
                        <span class="ion-hide-sm-up">Total: </span
                        >{{ product.sellingPrice * product.selectedQuantity }}
                      </ion-label>
                    </ion-col>
                    <ion-col size="12" size-sm>
                      <ion-button
                        @click="deleteSelectedProduct(key)"
                        class="ion-float-end"
                        :icon="trash"
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
          <ion-card-header>
            <ion-card-title>Customer & Payment</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list>
              <ion-item>
                <ion-label>Customer: </ion-label>
                <ion-label slot="end">
                  <ion-button
                    @click="openSelectCustomerModal"
                    class="ion-float-end"
                    >{{ customer.name ? customer.name : "Select" }}</ion-button
                  >
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Payment Method: </ion-label>
                <ion-select
                  v-model="paymentMethod"
                  @change="paymentMethod = $event.target.value"
                  ok-text="Okay"
                  cancel-text="Dismiss"
                >
                  <ion-select-option
                    value="cash"
                    :selected="paymentMethod == 'cash'"
                    >Cash</ion-select-option
                  >
                  <ion-select-option
                    value="cheque"
                    :selected="paymentMethod == 'cheque'"
                    >Cheque</ion-select-option
                  >
                  <ion-select-option
                    value="bankTransfer"
                    :selected="paymentMethod == 'bankTransfer'"
                    >Bank Transfer</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item
                v-if="
                  paymentMethod == 'cheque' || paymentMethod == 'bankTransfer'
                "
              >
                <ion-label>Bank Name: </ion-label>
                <ion-input
                  type="text"
                  @keyup="bankName = $event.target.value"
                  :value="bankName"
                ></ion-input>
              </ion-item>
              <ion-item v-if="paymentMethod == 'cheque'">
                <ion-label>Cheque Number: </ion-label>
                <ion-input
                  type="text"
                  @keyup="chequeNumber = $event.target.value"
                  :value="chequeNumber"
                ></ion-input>
              </ion-item>
              <ion-item v-if="paymentMethod == 'bankTransfer'">
                <ion-label>Transaction Id: </ion-label>
                <ion-input
                  type="text"
                  @keyup="transactionId = $event.target.value"
                  :value="transactionId"
                ></ion-input>
              </ion-item>
              <ion-item v-if="selectedProducts.length">
                <ion-label>Total: </ion-label>
                <ion-label slot="end">{{ getTotal() }}</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Amount Recived: </ion-label>
                <ion-input
                  type="number"
                  @keyup="
                    amountReceived =
                      $event.target.value >= total
                        ? amountReceived
                        : $event.target.value
                  "
                  :value="amountReceived"
                  :maxlength="total"
                ></ion-input>
                <ion-label slot="end">Rs</ion-label>
              </ion-item>
              <ion-item>
                <ion-label>Payment Status: </ion-label>
                <ion-select
                  v-model="paymentStatus"
                  @change="paymentStatus = $event.target.value"
                  ok-text="Okay"
                  cancel-text="Dismiss"
                >
                  <ion-select-option
                    value="received"
                    :selected="paymentStatus == 'received'"
                    >Received</ion-select-option
                  >
                  <ion-select-option
                    value="pending"
                    :selected="paymentStatus == 'pending'"
                    >Pending</ion-select-option
                  >
                  <ion-select-option
                    value="on-hold"
                    :selected="paymentStatus == 'on-hold'"
                    >On Hold</ion-select-option
                  >
                </ion-select>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Note: </ion-label>
                <ion-textarea
                  @keyup="note = $event.target.value"
                  :value="note"
                ></ion-textarea>
              </ion-item>
              <ion-item>
                <ion-button @click="crateNewEntry">Save</ion-button>
              </ion-item>
            </ion-list>
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
import {
  IonContent,
  IonPage,
  IonBackButton,
  modalController,
  IonInput,
  IonSelect,
} from "@ionic/vue";
import { db } from "@/main";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { emitter } from "@/services/emitter";
import SelectProductModelVue from "../components/models/SelectProductModel.vue";
import SelectCustomerMode from "../components/models/SelectCustomerMode.vue";
import { trash, pencil } from "ionicons/icons";
import { Storage } from "@ionic/storage";

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
    const store = new Storage();
    const state = reactive({
      errorMsg: "",
      type: "credit",
      selectedProducts: [] as any,
      customer: {},
      paymentMethod: "cash",
      bankName: "",
      chequeNumber: "",
      transactionId: "",
      total: 0,
      amountReceived: "",
      paymentStatus: "",
      note: "",
      selectProductModelVue: "" as any,
      selectCustomerModelVue: "" as any,
    });
    emitter.on("select_product_event", async (ob: any) => {
      state.selectedProducts.push({
        name: ob.product.name,
        sku: ob.product.sku,
        sellingPrice: ob.product.batches[ob.batchId].sellingPrice,
        purchasePrice: ob.product.batches[ob.batchId].purchasePrice,
        measurementUnit: ob.product.batches[ob.batchId].measurementUnit,
        stockQuantity: ob.product.batches[ob.batchId].stockQuantity,
        selectedQuantity: 1,
      });
      if (state.selectProductModelVue) {
        await state.selectProductModelVue.dismiss();
      }
    });
    emitter.on("close_product_model", async (product: any) => {
      if (state.selectProductModelVue) {
        await state.selectProductModelVue.dismiss();
      }
    });
    emitter.on("select_customer_event", async (customer: any) => {
      state.customer = {
        name: customer.name,
        email: customer.email,
      };
      if (state.selectCustomerModelVue) {
        await state.selectCustomerModelVue.dismiss();
      }
    });
    emitter.on("close_customer_model", async (product: any) => {
      if (state.selectCustomerModelVue) {
        await state.selectCustomerModelVue.dismiss();
      }
    });
    const crateNewEntry = async () => {
      try {
        await store.create();
        const selectedShop = await store.get("selectedShop");
        if (!selectedShop) {
          new Error("No Shop Seleted.");
          return;
        }
        await db
          .collection("shops")
          .doc(selectedShop)
          .collection("ledger")
          .add({
            createdAt: new Date().getTime(),
            lastUpdatedAt: new Date().getTime(),
            type: state.type,
            selectedProducts: state.selectedProducts,
            customer: state.customer,
            paymentMethod: state.paymentMethod,
            bankName: state.bankName,
            chequeNumber: state.chequeNumber,
            transactionId: state.transactionId,
            total: state.total,
            amountReceived: state.amountReceived,
            paymentStatus: state.paymentStatus,
            note: state.note,
          });
        router.back();
      } catch (error) {
        state.errorMsg = error.message;
      }
    };
    const typeChanged = ($even: any) => {
      state.type = $even.detail.value;
    };

    const openSelectProductModal = async () => {
      state.selectProductModelVue = await modalController.create({
        component: SelectProductModelVue,
      });
      return state.selectProductModelVue.present();
    };
    const openSelectCustomerModal = async () => {
      state.selectCustomerModelVue = await modalController.create({
        component: SelectCustomerMode,
      });
      return state.selectCustomerModelVue.present();
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
          return product.sellingPrice * product.selectedQuantity;
        })
        .reduce((a: any, b: any) => a + b, 0);
      return state.total;
    };
    return {
      ...toRefs(state),
      crateNewEntry,
      typeChanged,
      openSelectProductModal,
      openSelectCustomerModal,
      deleteSelectedProduct,
      trash,
      pencil,
      getTotal,
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
</style>
