<template>
    Utilisateur : {{ utilisateur?.prenom_employe }} {{ utilisateur?.nom_employe }} / {{ utilisateur?.login_employe }}
</template>
<script setup lang="ts">
import type { Utilisateur } from '@/axioscalls.ts'    
import { ref } from 'vue'
import { useDataStore } from '@/stores/datastore.ts'
import { getDataUserInfo } from '@/axioscalls.ts'
const props = defineProps({
    groupeSecurite: {
        type: String,
        required: false
    }
})
const lesDatas = useDataStore()
const grpSecurite: string = props.groupeSecurite || ''
const utilisateur = ref<Utilisateur>()
utilisateur.value = await getDataUserInfo(grpSecurite)
if (utilisateur.value.id_employe) {
    lesDatas.idEmployeUser = utilisateur.value.id_employe
}    
if (utilisateur.value.nom_employe) {
    lesDatas.nomEmployeUser = utilisateur.value.nom_employe
}    
if (utilisateur.value.prenom_employe) {
    lesDatas.prenomEmployeUser = utilisateur.value.prenom_employe
}    
if (utilisateur.value.login_employe) {
    lesDatas.loginEmployeUser = utilisateur.value.login_employe
}
if (grpSecurite !== '') {
    lesDatas.groupeSecurite = grpSecurite
    if (utilisateur.value.bingroupe !== undefined) {
        if (utilisateur.value.bingroupe === 1) {
            lesDatas.bInGroupe = true
        } else {
            lesDatas.bInGroupe = false
            lesDatas.messageErreur = `Utilisation autorisée uniquement aux membres du groupe ${lesDatas.groupeSecurite}`  
        }   
    }    
}
if (utilisateur.value.message) {
    lesDatas.messageErreur = utilisateur.value.message    
}
</script>
