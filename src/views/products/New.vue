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
            <ion-card-title></ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col>
                  <ion-item>
                    <ion-label position="floating">Name*</ion-label>
                    <ion-input></ion-input>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <ion-item>
                    <ion-label position="floating">Price*</ion-label>
                    <ion-input></ion-input>
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <ion-item>
                    <ion-label position="floating">SKU*</ion-label>
                    <ion-input></ion-input>
                  </ion-item>
                </ion-col>
                <ion-col>
                  <ion-button color="primary" v-on:click="openScanner">Scan</ion-button>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <ion-item>
                    <ion-label position="floating">Sale Price*</ion-label>
                    <ion-input></ion-input>
                  </ion-item>
                </ion-col>
                <ion-col>
                  <ion-item>
                    <ion-label>On Sale</ion-label>
                    <ion-toggle value="on_sale" />
                  </ion-item>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col>
                  <ion-item>
                    <ion-label position="floating">Quantity</ion-label>
                    <ion-input></ion-input>
                  </ion-item>
                </ion-col>
                <ion-col>
                  <ion-item>
                    <ion-label>Metered</ion-label>
                    <ion-toggle value="metered" />
                  </ion-item>
                </ion-col>
              </ion-row>
            </ion-grid>
            <ion-button expand="block">Create</ion-button>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonPage } from "@ionic/vue";
import { QRScanner, QRScannerStatus } from "@ionic-native/qr-scanner";

export default {
  name: "NewProduct",
  components: {
    IonContent,
    IonPage,
  },
  setup() {
    const openScanner = async () => {
      QRScanner.prepare()
        .then((status: QRScannerStatus) => {
          if (status.authorized) {
            // camera permission was granted
            // start scanning
            const scanSub = QRScanner.scan().subscribe((text: string) => {
              console.log("Scanned something", text);

              QRScanner.hide(); // hide camera preview
              scanSub.unsubscribe(); // stop scanning
            });
          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
          }
        })
        .catch((e: any) => alert(e));
    };
    return { openScanner };
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
