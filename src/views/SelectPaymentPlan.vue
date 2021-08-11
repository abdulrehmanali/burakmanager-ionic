<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div id="container">
            <ion-card v-for="(p,i) in  plans" :key="i">
                <ion-card-header>
                    <ion-card-subtitle>{{p.name}}</ion-card-subtitle>
                    <ion-card-title>{{p.amount}}/{{p.period}}</ion-card-title>
                </ion-card-header>

                <ion-card-content>
                      <ion-list>
                        <ion-item v-for="(b,pb) in  p.benefits" :key="pb">
                            <ion-label>{{b.name}}</ion-label>
                            <ion-note slot="end">{{b.quantity}}</ion-note>
                        </ion-item>
                    </ion-list>
                    <ion-button expand="block">Select</ion-button>
                </ion-card-content>
            </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from '@ionic/vue';

export default {
  name: 'SelectPaymentPlan',
  components: {
    IonContent,
    IonPage
  },
  data:function(){
      return {
          plans:[
              {
                "name":"Basic",
                "amount":"499",
                "period":"monthly",
                "benefits":[
                    {
                        name:"No of Shops",
                        quantity:1
                    },
                    {
                        name:"No of Products",
                        quantity:200
                    },
                    {
                        name:"No of Users",
                        quantity:1
                    },
                    {
                        name:"No of Checkouts",
                        quantity:"Unlimited"
                    }
                ]
              },
            {
                "name":"Premium",
                "amount":"1499",
                "period":"monthly",
                "benefits":[
                    {
                        name:"No of Shops",
                        quantity:2
                    },
                    {
                        name:"No of Products",
                        quantity:1000
                    },
                    {
                        name:"No of Users",
                        quantity:5
                    },
                    {
                        name:"No of Checkouts",
                        quantity:"Unlimited"
                    }
                ]
              },
            {
                "name":"Pro",
                "amount":"3499",
                "period":"monthly",
                "benefits":[
                    {
                        name:"No of Shops",
                        quantity:3
                    },
                    {
                        name:"No of Products",
                        quantity:2500
                    },
                    {
                        name:"No of Users",
                        quantity:8
                    },
                    {
                        name:"No of Checkouts",
                        quantity:"Unlimited"
                    }
                ]
              }
          ]
      }
  },
}
</script>

<style scoped>
#container {
    text-align: center;
}
@media (min-width: 760px) {
  #container {
    display: flex;
    justify-content: center;
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>