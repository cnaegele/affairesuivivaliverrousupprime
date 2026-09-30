import axios from 'axios'
import type { AxiosResponse } from 'axios'

let server: string = ''
if (import.meta.env.DEV) {
  server = 'https://mygolux.lausanne.ch'
}

export interface Utilisateur {
  id_employe?: number
  nom_employe?: string
  prenom_employe?: string
  login_employe?: string
  groupesecurite?: string
  bingroupe?: number
  message?: string
}

// Réponse de base commune à toutes les API
export interface ApiResult {
  success: boolean
  message: string
}

// Interface générique pour les réponses API
export interface ApiResponse<T> extends ApiResult {
  data?: T[]
}

/* ---------- Suivi : format brut renvoyé par le PHP ---------- */

export type CodeLigneSuivi = 'suivi' | 'validation' | 'verrou'

// Une ligne de strjson (tous les champs sont nullables selon le code)
export interface LigneSuiviRaw {
  idsuivi: number
  code: CodeLigneSuivi
  date: string | null
  datecreation: string | null
  suivi: string | null
  idaffaire: number | null
  nomaffaire: string | null
  descaffaire: string | null
  computed: string | null
  btermine: number | null
  employe: string | null
  unite: string | null
  employecre: string | null
  unitec: string | null
  empvv: string | null
  unitevv: string | null
  datevv: string | null
}

// Réponse brute du PHP
interface DataSuiviRaw extends ApiResult {
  id?: string
  strjson?: string
}

/* ---------- Suivi : format structuré utilisé dans l'app ---------- */

export interface InfoSuivi {
  idsuivi: number
  date: string | null
  datecreation: string | null
  suivi: string | null
  idaffaire: number | null
  nomaffaire: string | null
  descaffaire: string | null
  computed: string | null
  btermine: boolean
  employe: string | null
  unite: string | null
  employecre: string | null
  unitec: string | null
}

// Validation ou verrou
export interface InfoValidVerrou {
  employe: string | null
  unite: string | null
  date: string | null
}

export interface DataSuivi extends ApiResult {
  id?: number
  suivi?: InfoSuivi
  validations: InfoValidVerrou[]
  verrous: InfoValidVerrou[]
}

/* ---------- Appels API ---------- */

export async function getDataUserInfo(groupeSecurite: string): Promise<Utilisateur> {
  const page: string = '/goeland/gestion_spec/g_login_f5.php'
  const url: string = `${server}${page}`
  const params = new URLSearchParams([['groupesecurite', groupeSecurite]])
  const response: AxiosResponse<Utilisateur> = await axios.get(url, { params })
  return response.data
}

export async function getDataSuivi(idAffaireSuivi: number): Promise<DataSuivi> {
  const page: string = '/goeland/gestion_spec/affairesuivi_valid_verrou_supprime/axios/affairesuivi_valid_verrou_data.php'
  const url: string = `${server}${page}`
  const params = new URLSearchParams([['idaffairesuivi', idAffaireSuivi.toString()]])
  try {
    const response: AxiosResponse<DataSuiviRaw> = await axios.get(url, { params })
    return transformeDataSuivi(response.data, idAffaireSuivi)
  } catch (error) {
    return { success: false, message: `ERREUR. ${traiteAxiosError(error)}`, validations: [], verrous: [] }
  }
}

/* ---------- Transformation ---------- */

function transformeDataSuivi(raw: DataSuiviRaw, idAffaireSuivi: number): DataSuivi {
  const result: DataSuivi = {
    success: raw.success,
    message: raw.message,
    id: raw.id !== undefined ? Number(raw.id) : undefined,
    validations: [],
    verrous: [],
  }
  if (!raw.success) {
    return result
  }

  let lignes: LigneSuiviRaw[] = []
  if (raw.strjson) {
    try {
      lignes = JSON.parse(raw.strjson) as LigneSuiviRaw[]
    } catch {
      return { ...result, success: false, message: 'ERREUR. strjson invalide' }
    }
  }

  for (const l of lignes) {
    switch (l.code) {
      case 'suivi':
        result.suivi = {
          idsuivi: l.idsuivi,
          date: l.date,
          datecreation: l.datecreation,
          suivi: l.suivi,
          idaffaire: l.idaffaire,
          nomaffaire: l.nomaffaire,
          descaffaire: l.descaffaire,
          computed: l.computed,
          btermine: l.btermine === 1,
          employe: l.employe,
          unite: l.unite,
          employecre: l.employecre,
          unitec: l.unitec,
        }
        break
      case 'validation':
        result.validations.push({ employe: l.empvv, unite: l.unitevv, date: l.datevv })
        break
      case 'verrou':
        result.verrous.push({ employe: l.empvv, unite: l.unitevv, date: l.datevv })
        break
    }
  }

  // Pas de ligne "suivi" : l'identifiant n'existe pas
  if (!result.suivi) {
    return { ...result, success: false, message: `Le suivi ${idAffaireSuivi} n'existe pas` }
  }

  return result
}

/* ---------- Gestion d'erreur ---------- */

function traiteAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = typeof error.response.data === 'string'
        ? error.response.data
        : JSON.stringify(error.response.data)
      return `${data}<br>${error.response.status}<br>${JSON.stringify(error.response.headers)}`
    }
    if (error.request?.responseText) {
      return error.request.responseText
    }
    return error.message
  }
  return error instanceof Error ? error.message : String(error)
}