<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/ledger"></ion-back-button>
        </ion-buttons>
        <ion-title>Edit Entry</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
            <form @submit.prevent="saveCustomer(id, name, contactNumber, email)">
              <ion-grid>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Name*</ion-label>
                      <ion-input
                        v-model="customer.name"
                        :value="customer.name"
                        @input="customer.name = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Contact Number</ion-label>
                      <ion-input
                        v-model="customer.contactNumber"
                        :value="customer.contactNumber"
                        @input="customer.contactNumber = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Email</ion-label>
                      <ion-input
                        v-model="customer.email"
                        :value="customer.email"
                        @input="customer.email = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-button expand="block" type="submit">Save</ion-button>
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
import { IonContent, IonPage, IonBackButton } from "@ionic/vue";
import { db } from "@/main";
import router from "@/router";
import { reactive, toRefs } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { Storage } from '@ionic/storage';

export default {
  name: "EditCustomer",
  components: {
    IonContent,
    IonPage,
    IonBackButton
  },
  setup() {
    const store = new Storage();
    const route = useRoute();
    const { id } = route.params;
    const state = reactive({
      customer: {},
      id: "",
      errorMsg: "",
    });
    state.id = id as any;
    const getCustomer = async (id) => {
      try {
        await store.create();
        const selectedShop = await store.get('selectedShop');
        const product = await db
          .collection("shops")
          .doc(selectedShop)
          .collection("customers")
          .doc(id)
          .get();
        state.customer = product.data() as any;
      } catch (error) {
        state.errorMsg = error.message;
      }
    };

    const saveCustomer = async (
      id: string,
      name: string,
      contactNumber: string,
      email: string
    ) => {
      try {
        const selectedShop = await store.get('selectedShop');
        await db
          .collection("shops")
          .doc(selectedShop)
          .collection("customers")
          .doc(id)
          .set({
            lastUpdatedAt: new Date().getTime(),
            name: name,
            contactNumber: contactNumber,
            email: email,
          });
        router.back();
      } catch (error) {
        state.errorMsg = error.message;
      }
    };
    getCustomer(id);
    return { ...toRefs(state), saveCustomer, router };
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
