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
            <ion-card-title>New Shop</ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <form @submit.prevent="createNewShop(name, address)">
              <ion-item>
                <ion-label position="floating">Name</ion-label>
                <ion-input v-model="name" @input="name = $event.target.value"></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Address</ion-label>
                <ion-textarea
                  clear-on-edit="true"
                  v-model="address"
                  @input="address = $event.target.value"
                ></ion-textarea>
              </ion-item>
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
import { reactive, toRefs } from "@vue/reactivity";
import { auth, db } from "@/main";
import { useRouter } from "vue-router";

export default {
  name: "NewShop",
  setup() {
    const router = useRouter();
    const state = reactive({
      name: "",
      address: "",
      errorMsg: "",
    });
    const createNewShop = async (name: string, address: string) => {
      const users: any = [];
      users[auth.currentUser?.uid || ""] = {
        canAccessStats: true,
        canCheckout: true,
        canCreateNewProducts: true,
        canEditProducts: true,
        createdAt: new Date().getTime(),
        lastUpdatedAt: new Date().getTime(),
      };
      try {
        const shop = await db.collection("shops").add({
          admin: auth.currentUser?.uid,
          createdAt: new Date().getTime(),
          lastUpdatedAt: new Date().getTime(),
          name,
          address,
          users,
        });

        const shops: any = [];
        shops[shop.id] = name;
        await db.collection("users").doc(auth.currentUser?.uid).update({
          shops,
        });
        router.push("/");
      } catch (error) {
        state.errorMsg = error.message;
      }
    };

    return {
      ...toRefs(state),
      createNewShop,
      router,
    };
  },
  components: {
    IonContent,
    IonPage,
  },
};
</script>

<style scoped>
#container {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 50px;
  flex-direction: column;
  align-items: center;
}
#container ion-card {
  max-width: 720px;
  width: 100%;
}
</style>
