import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'

// Interfaces TypeScript pour typer les données
interface TypeObjet {
  id: number
  nom: string
  description?: string
}

export interface Employe {
  id: number
  nom: string
  prenom: string
  actif: number
  unite: string
}

interface DataStoreState {
  idEmployeUser: Ref<number>
  nomEmployeUser: Ref<string>
  prenomEmployeUser: Ref<string>
  loginEmployeUser: Ref<string>
  groupeSecurite: Ref<string>
  bInGroupe: Ref<boolean>
  idService: Ref<number>
  nomService: Ref<string>
  descriptionService: Ref<string>
  idAffaireSuivi: Ref<number>
  messageErreur: Ref<string>
}

export const useDataStore = defineStore('iddata', (): DataStoreState => {
  const idEmployeUser = ref<number>(0)
  const nomEmployeUser = ref<string>('')
  const prenomEmployeUser = ref<string>('')
  const loginEmployeUser = ref<string>('')
  const groupeSecurite = ref<string>('')
  const bInGroupe = ref<boolean>(false)
  const idService = ref<number>(0)
  const nomService = ref<string>('')
  const descriptionService = ref<string>('')
  const idAffaireSuivi = ref<number>(0)
  const messageErreur = ref<string>('')

  return {
    idEmployeUser,
    nomEmployeUser,
    prenomEmployeUser,
    loginEmployeUser,
    groupeSecurite,
    bInGroupe,
    idService,
    nomService,
    descriptionService,
    idAffaireSuivi,
    messageErreur  
  }
})