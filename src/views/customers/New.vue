<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/customers"></ion-back-button>
        </ion-buttons>
        <ion-title>New Customer</ion-title>
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
                      <ion-label position="floating">Contact Number</ion-label>
                      <ion-input
                        v-model="contactNumber"
                        type="phonenumber"
                        @input="contactNumber = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
                <ion-row>
                  <ion-col>
                    <ion-item>
                      <ion-label position="floating">Email</ion-label>
                      <ion-input
                        v-model="email"
                        type="email"
                        @input="email = $event.target.value"
                      ></ion-input>
                    </ion-item>
                  </ion-col>
                </ion-row>
              </ion-grid>
              <ion-button expand="block" v-on:click="createNewCustomer()" :disabled="disableSave">Create</ion-button>
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
import { Storage } from '@ionic/storage';

export default {
  name: "NewProduct",
  components: {
    IonContent,
    IonPage,
    IonBackButton
  },
  setup() {
    const store = new Storage();
    const state = reactive({
      name: "",
      contactNumber: "",
      email: "",
      errorMsg: "",
      disableSave:false
    });
    const createNewCustomer = async () => {
      try {
        state.disableSave = true;
        await store.create();
        const selectedShop = await store.get('selectedShop');
        const name = state.name;
        const contactNumber = state.contactNumber;
        const email = state.email;
        await db
          .collection("shops")
          .doc(selectedShop)
          .collection("customers")
          .add({
            createdAt: new Date().getTime(),
            lastUpdatedAt: new Date().getTime(),
            name: name,
            contactNumber: contactNumber,
            email: email,
          });
        state.disableSave = false;
        router.back();
      } catch (error) {
        state.errorMsg = error.message;
        state.disableSave = false;
      }
    };
    return { ...toRefs(state), createNewCustomer };
  },
};
</script>

<style scoped></style>
