<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
            <ion-card-header>
                <ion-card-title>Sign Up</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <form @submit.prevent="signUpWithEmailAndPassword(name, email, password, phoneNumber)">
                  <ion-item>
                      <ion-label position="floating">Name*</ion-label>
                      <ion-input v-model="name" @input="name = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-item>
                      <ion-label position="floating">Email*</ion-label>
                      <ion-input v-model="email" type="email" @input="email = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-item>
                      <ion-label position="floating">Phone Number*</ion-label>
                      <ion-input v-model="phoneNumber" @input="phoneNumber = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-item>
                      <ion-label position="floating">Password*</ion-label>
                      <ion-input v-model="password" type="password" @input="password = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-item> 
                      <ion-label position="floating">Confirm Password*</ion-label>
                      <ion-input v-model="confirmPassword" type="password" @input="confirmPassword = $event.target.value"></ion-input>
                  </ion-item>
                  <ion-button expand="block" type="submit">Sign Up</ion-button>
                  <ion-button
                    color="medium"
                    expand="block"
                    @click="() => router.push('/login')"
                    >Login</ion-button
                  >
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
import {reactive, toRefs} from "vue";
import { IonContent, IonPage } from '@ionic/vue';
import { auth, db } from "../main";
import { useRouter } from 'vue-router';

export default {
  name: 'Signup',
  components: {
    IonContent,
    IonPage
  },
    setup() {
    const router = useRouter();
    const state = reactive({
      name: "",
      email: "",
      password: "",
      phoneNumber:"",
      errorMsg: "",
    });
    const signUpWithEmailAndPassword = async (
      name: string,
      email: string,
      password: string,
      phoneNumber: string
    ) => {
      try {
        if (!name || !email || !password || !phoneNumber) {
          state.errorMsg = "Name, Email,Phone Number, and Password Required";
          return;
        }
        const authRes = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        db.collection("users").doc(authRes.user?.uid).set({
          name,
          email,
          createdAt:new Date().getTime(),
          lastUpdatedAt:new Date().getTime(),
          phoneNumber
        });
        router.push("/");
      } catch (error) {
        state.errorMsg = error.message;
      }
    };
    return {
      ...toRefs(state),
      signUpWithEmailAndPassword,
      router
    };
  },
}
</script>

<style scoped>
#container {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top:50px;
  flex-direction: column;
  align-items: center;
}
#container ion-card{
  max-width: 720px;
  width: 100%;
}
.error-message {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
  text-align: center;
}
</style>