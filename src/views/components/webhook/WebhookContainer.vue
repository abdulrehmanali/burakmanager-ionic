<template>
    <ion-card>
      <ion-card-header>
        <ion-row class="ion-align-items-start">
          <ion-col>
            <ion-card-title class="card-title">Webhooks</ion-card-title>
          </ion-col>
          <ion-col>
            <ion-button @click="addNewWebhook" class="ion-float-end">New</ion-button>
          </ion-col>
        </ion-row>
      </ion-card-header>
      <ion-card-content>
        <webhook-item v-for="(webhook, i) of webhooks" :key="i" :platformName="webhook.platform_name" :receivingStoreUrl="webhook.platform_name" :authKey="webhook.platform_name"/>
      </ion-card-content>
    </ion-card>
</template>

<script>
import { onIonViewWillEnter } from '@ionic/vue';
import { allShopWebHooks } from "@/services/shopWebhooks.services";
import { reactive, toRefs } from '@vue/reactivity';
import WebhookItem from './WebhookItem.vue';
import { add } from 'ionicons/icons';

export default {
  components: { WebhookItem },
  name: 'WebhookContainer',
  setup() {
    const state = reactive({
      webhooks: []
    });
    const getShopWebhooks = () => {
      allShopWebHooks().then((res)=>{
        state.webhooks = res.data.webhooks
      })
    }

    const addNewWebhook = () => {
      state.webhooks.push({
      platformName:'',
      receivingStoreUrl: '',
      authKey: '',
      isNew: true
    })
    }
    onIonViewWillEnter(() => {
      getShopWebhooks()
    });

    return {...toRefs(state), add, addNewWebhook}
  }
}
</script>

<style>

</style>