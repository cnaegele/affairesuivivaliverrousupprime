<template>
  <v-container>
    <v-progress-linear v-if="loading" indeterminate />

    <v-alert v-else-if="erreur" type="error" variant="tonal">
      {{ erreur }}
    </v-alert>

    <v-card v-else-if="data?.suivi" variant="flat">
      <v-card-text>
        <div class="grille">
          <div class="label">Id Affaire</div>
          <div>{{ data.suivi.idaffaire }}</div>

          <div class="label">Nom</div>
          <div>{{ data.suivi.nomaffaire }}</div>

          <div class="label">Description</div>
          <div class="multiligne">{{ data.suivi.descaffaire }}</div>

          <div class="label">Statut</div>
          <div>
            <v-chip :color="data.suivi.btermine ? 'success' : 'warning'" size="small" label>
              {{ data.suivi.btermine ? 'Terminé' : 'En cours' }}
            </v-chip>
          </div>

          <div class="label">Suivi</div>
          <div class="multiligne">{{ data.suivi.suivi }}</div>

          <div class="label">Nombre de validations</div>
          <div>{{ data.validations.length }}</div>

          <div class="label">Nombre de verrous</div>
          <div>{{ data.verrous.length }}</div>

          <div class="label">Validation(s)</div>
          <div>
            <div v-for="(v, i) in data.validations" :key="`val-${i}`">
              {{ v.employe }} — {{ v.unite }} — {{ v.date }}
            </div>
            <span v-if="data.validations.length === 0" class="text-medium-emphasis">Aucune</span>
          </div>

          <div class="label">Verrou(s)</div>
          <div>
            <div v-for="(v, i) in data.verrous" :key="`ver-${i}`">
              {{ v.employe }} — {{ v.unite }} — {{ v.date }}
            </div>
            <span v-if="data.verrous.length === 0" class="text-medium-emphasis">Aucun</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDataStore } from '@/stores/datastore.ts'
import { getDataSuivi } from '@/axioscalls.ts'
import type { DataSuivi } from '@/axioscalls.ts'

const lesDatas = useDataStore()

const data = ref<DataSuivi | null>(null)
const loading = ref(false)
const erreur = ref('')

watch(() => lesDatas.idAffaireSuivi, async (newValue) => {
  if (newValue === 0) {
    data.value = null
    erreur.value = ''
    return
  }
  loading.value = true
  erreur.value = ''
  const response = await getDataSuivi(newValue)
  if (response.success) {
    data.value = response
  } else {
    data.value = null
    erreur.value = response.message
  }
  loading.value = false
}, { immediate: true })
</script>

<style scoped>
.grille {
  display: grid;
  grid-template-columns: max-content 1fr;
  column-gap: 24px;
  row-gap: 10px;
}
.label {
  font-weight: 600;
}
.multiligne {
  white-space: pre-line; /* affiche les \n comme des sauts de ligne */
}
</style>