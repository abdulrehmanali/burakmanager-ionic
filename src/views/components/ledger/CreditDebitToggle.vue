<template>
  <ion-segment value="credit" @ionChange="segmentChanged" class="custom-segment">
    <ion-segment-button value="credit">
      <ion-label>Credit</ion-label>
    </ion-segment-button>
    <ion-segment-button value="debit">
      <ion-label>Debit</ion-label>
    </ion-segment-button>
  </ion-segment>
</template>

<script lang="ts">
  import { IonLabel, IonSegment, IonSegmentButton } from '@ionic/vue';
  import { defineComponent } from 'vue';

  
  export default defineComponent({
    name:"CreditDebitToggle",
    components: { IonLabel, IonSegment, IonSegmentButton },
    props: {
      value: {
        type: String,
        required: true, // Makes the prop mandatory
      },
    },
    emits: ['onUpdate'],
    setup(){
      const segmentChanged = (e: { detail: { value: any } })=>{
        console.log(e.detail.value)
      }
    return {segmentChanged}
    }
  });

</script>

<style>
/* Light mode styles */
.custom-segment {
  --background: #f1f1f1; /* Light mode container background */
  --button-background: #ffffff; /* Light mode button background */
  --button-background-checked: #42d77d; /* Active button in light mode */
  --button-border-radius: 50px; /* Pill shape */
  --button-color: #666666; /* Light mode button text color */
  --button-color-checked: #ffffff; /* Active button text in light mode */
  --indicator-color: transparent; /* Hide the indicator */
  padding: 4px;
  border-radius: 50px;
  border: 1px solid #ccc;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
  .custom-segment {
    --background: #2b2b2b; /* Dark mode container background */
    --button-background: #444444; /* Dark mode button background */
    --button-background-checked: #3cb371; /* Active button in dark mode */
    --button-color: #cccccc; /* Dark mode button text color */
    --button-color-checked: #ffffff; /* Active button text in dark mode */
    border: 1px solid #555555; /* Border for dark mode */
  }
}

/* Button spacing */
ion-segment-button {
  margin: 2px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 50px;
  border: 0px;
  --indicator-color: transparent;
}

/* Smooth transitions for active state */
ion-segment-button.segment-button-checked {
  transition: background-color 0.3s, color 0.3s;
  background: #42d77d;
}

</style>