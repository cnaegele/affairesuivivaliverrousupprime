<template>
  <div class="conteneur">
    <div v-if="loading" class="chargement">Chargement…</div>

    <div v-else-if="erreur" class="alerte-erreur">
      {{ erreur }}
    </div>

    <div v-else-if="data?.suivi" class="carte">
      <div class="grille">
        <div class="label">Id Affaire</div>
        <div>{{ data.suivi.idaffaire }}</div>

        <div class="label">Nom</div>
        <div>{{ data.suivi.nomaffaire }}</div>

        <div class="label">Description</div>
        <div class="multiligne">{{ data.suivi.descaffaire }}</div>

        <div class="label">Statut</div>
        <div>
          <span class="badge" :class="data.suivi.btermine ? 'badge-termine' : 'badge-encours'">
            {{ data.suivi.btermine ? 'Terminé' : 'En cours' }}
          </span>
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
          <span v-if="data.validations.length === 0" class="discret">Aucune</span>
        </div>

        <div class="label">Verrou(s)</div>
        <div>
          <div v-for="(v, i) in data.verrous" :key="`ver-${i}`">
            {{ v.employe }} — {{ v.unite }} — {{ v.date }}
          </div>
          <span v-if="data.verrous.length === 0" class="discret">Aucun</span>
        </div>
      </div>

      <div v-if="data.validations.length > 0 || data.verrous.length > 0" class="actions">
        <button type="button" class="btn-danger" @click="supprimer">
          Supprimer validation et verrou(s)
        </button>
      </div>
    </div>
  </div>
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

async function supprimer(): Promise<void> {
  // TODO: à implémenter
  console.log('supprimer', lesDatas.idAffaireSuivi)
}
</script>

<style scoped>
.conteneur {
  max-width: 1000px;
  margin: 0 auto;
  padding: 16px;
  font-family: system-ui, sans-serif;
  font-size: 14px;
  color: #222;
}

.carte {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
}

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

.discret {
  color: #888;
}

.chargement {
  color: #666;
}

.alerte-erreur {
  padding: 12px 16px;
  border-left: 4px solid #c62828;
  border-radius: 4px;
  background: #fdecea;
  color: #8e1c1c;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}
.badge-termine {
  background: #e3f4e5;
  color: #1b6e2a;
}
.badge-encours {
  background: #fff4e0;
  color: #a15c00;
}

.actions {
  margin-top: 24px;
}

.btn-danger {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #c62828;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-danger:hover {
  background: #a31f1f;
}
.btn-danger:focus-visible {
  outline: 2px solid #c62828;
  outline-offset: 2px;
}
</style>