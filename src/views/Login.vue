<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Login</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <form @submit.prevent="signInWithEmailAndPassword(email, password)">
              <ion-item>
                <ion-label position="floating">Email</ion-label>
                <ion-input
                  type="email"
                  v-model="email"
                  @input="email = $event.target.value"
                ></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Password</ion-label>
                <ion-input
                  type="password"
                  v-model="password"
                  @input="password = $event.target.value"
                ></ion-input>
              </ion-item>
              <ion-button type="submit" expand="block">Login</ion-button>
            </form>
            <ion-button
              color="medium"
              expand="block"
              @click="() => router.push('/signup')"
              >Sign Up</ion-button
            >
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
import { reactive, toRefs } from "vue";
import { IonContent, IonPage } from "@ionic/vue";
import { useRouter } from "vue-router";
import { auth } from "../main";

export default {
  name: "Login",
  setup() {
    const router = useRouter();
    const state = reactive({
      email: "",
      password: "",
      errorMsg: "",
    });
    const signInWithEmailAndPassword = async (email: string, password: string) => {
      try {
        if (!email || !password) {
          state.errorMsg = "Email and Password is Required";
          return;
        }
         await auth.signInWithEmailAndPassword(email, password);
        location.href = "/";
      } catch (error) {
        state.errorMsg = error.message;
      }
    };
    return {
      ...toRefs(state),
      signInWithEmailAndPassword,
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
  margin-top: 100px;
  flex-direction: column;
  align-items: center;
}
#container ion-card {
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
