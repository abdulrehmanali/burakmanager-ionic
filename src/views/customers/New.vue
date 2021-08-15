<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>New Customer</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-content>
            <form @submit.prevent="createNewCustomer(name, contactNumber, email)">
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
                        @input="email = $event.target.value"
                      ></ion-input>
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
      contactNumber: "",
      email: "",
      errorMsg: "",
    });
    const createNewCustomer = async (
      name: string,
      contactNumber: string,
      email: string
    ) => {
      try {
        await db
          .collection("shops")
          .doc(localStorage.selectedShop)
          .collection("customers")
          .add({
            createdAt: new Date().getTime(),
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
    return { ...toRefs(state), createNewCustomer };
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
