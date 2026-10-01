<template>
  <header class="header-flex">
    <h2>Suppression de la validation et des verrous d'un suivi.</h2>
    <div style="font-size: 14px; color: red;">
      A n'effectuer que si c'est impossible que le valideur et les vérouilleurs suppriment eux mêmes validation et verrous.
    </div>
    <div class="user-info">
      <suspense>
        <UserInformation groupeSecurite="GoelandManager"></UserInformation>
      </suspense>
    </div>
  </header>

  <main>
    <div id="app">
      <hr>
      <div v-if="lesDatas.messageErreur != ''" id="divErreur">{{ lesDatas.messageErreur }}</div>
      <div v-else class="flex-container">
        <input v-model.trim="saisieId" type="text" inputmode="numeric" placeholder="N° de suivid'affaire"
          :class="{ invalide: erreurSaisie }" @keyup.enter="chercherAffaireSuivi" @input="erreurSaisie = false" />
        &nbsp;
        <button type="button" title="Va chercher les informations" @click="chercherAffaireSuivi">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
        </button>
      </div>
      <hr>
      <div v-if="lesDatas.idAffaireSuivi !== 0">
        <SuiviValidationVerrousData></SuiviValidationVerrousData>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
  import { useDataStore } from '@/stores/datastore.ts'
  import UserInformation from '@/components/UserInformation.vue'
  import SuiviValidationVerrousData from '@/components/SuiviValidationVerrousData.vue'
  import { ref } from 'vue'

  const lesDatas = useDataStore()
  const saisieId = ref('')
  const erreurSaisie = ref(false)

  function chercherAffaireSuivi() {
    if (/^[1-9]\d*$/.test(saisieId.value)) {
      lesDatas.idAffaireSuivi = parseInt(saisieId.value, 10)
    } else {
      erreurSaisie.value = true
    }
  }
</script>

<style scoped></style>
