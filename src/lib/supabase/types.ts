// Types Supabase pour Slow Village Qualité
export interface Database {
    public: {
        Tables: {
            sites: {
                Row: {
                    id: string
                    nom: string
                    code: string
                    region: string | null
                    directeur_id: string | null
                    date_ouverture: string | null
                    date_fermeture: string | null
                    statut: string
                    score_conformite: number
                    nb_bloquants: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nom: string
                    code: string
                    region?: string | null
                    directeur_id?: string | null
                    date_ouverture?: string | null
                    date_fermeture?: string | null
                    statut?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nom?: string
                    code?: string
                    region?: string | null
                    directeur_id?: string | null
                    date_ouverture?: string | null
                    date_fermeture?: string | null
                    statut?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            themes: {
                Row: {
                    id: string
                    code: string
                    nom: string
                    description: string | null
                    ordre_affichage: number
                    couleur: string
                }
                Insert: {
                    id?: string
                    code: string
                    nom: string
                    description?: string | null
                    ordre_affichage?: number
                    couleur?: string
                }
                Update: {
                    id?: string
                    code?: string
                    nom?: string
                    description?: string | null
                    ordre_affichage?: number
                    couleur?: string
                }
            }
            sous_themes: {
                Row: {
                    id: string
                    theme_id: string
                    nom: string
                    lot: string | null
                    ordre_affichage: number
                }
                Insert: {
                    id?: string
                    theme_id: string
                    nom: string
                    lot?: string | null
                    ordre_affichage?: number
                }
                Update: {
                    id?: string
                    theme_id?: string
                    nom?: string
                    lot?: string | null
                    ordre_affichage?: number
                }
            }
            criteres: {
                Row: {
                    id: string
                    code: string
                    sous_theme_id: string | null
                    texte: string
                    priorite: 'P0' | 'P1' | 'P2' | 'P3'
                    obligatoire: boolean
                    poids: number
                    preuve_photo: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    code: string
                    sous_theme_id?: string | null
                    texte: string
                    priorite: 'P0' | 'P1' | 'P2' | 'P3'
                    obligatoire?: boolean
                    poids?: number
                    preuve_photo?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    code?: string
                    sous_theme_id?: string | null
                    texte?: string
                    priorite?: 'P0' | 'P1' | 'P2' | 'P3'
                    obligatoire?: boolean
                    poids?: number
                    preuve_photo?: boolean
                    created_at?: string
                }
            }
            audits: {
                Row: {
                    id: string
                    site_id: string
                    auditeur_id: string | null
                    periode_debut: string
                    periode_fin: string | null
                    statut: string
                    score_total: number | null
                    score_max: number | null
                    taux_conformite: number | null
                    nb_bloquants: number
                    commentaire_general: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    site_id: string
                    auditeur_id?: string | null
                    periode_debut: string
                    periode_fin?: string | null
                    statut?: string
                    score_total?: number | null
                    score_max?: number | null
                    taux_conformite?: number | null
                    nb_bloquants?: number
                    commentaire_general?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    site_id?: string
                    auditeur_id?: string | null
                    periode_debut?: string
                    periode_fin?: string | null
                    statut?: string
                    score_total?: number | null
                    score_max?: number | null
                    taux_conformite?: number | null
                    nb_bloquants?: number
                    commentaire_general?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            audit_reponses: {
                Row: {
                    id: string
                    audit_id: string
                    critere_id: string
                    statut: 'conforme' | 'non_conforme' | 'en_cours' | 'na'
                    score_obtenu: number
                    score_possible: number
                    commentaire: string | null
                    photos: string[]
                    saisi_par: string | null
                    saisi_le: string
                    modifie_par: string | null
                    modifie_le: string | null
                }
                Insert: {
                    id?: string
                    audit_id: string
                    critere_id: string
                    statut: 'conforme' | 'non_conforme' | 'en_cours' | 'na'
                    score_obtenu?: number
                    score_possible?: number
                    commentaire?: string | null
                    photos?: string[]
                    saisi_par?: string | null
                    saisi_le?: string
                    modifie_par?: string | null
                    modifie_le?: string | null
                }
                Update: {
                    id?: string
                    audit_id?: string
                    critere_id?: string
                    statut?: 'conforme' | 'non_conforme' | 'en_cours' | 'na'
                    score_obtenu?: number
                    score_possible?: number
                    commentaire?: string | null
                    photos?: string[]
                    saisi_par?: string | null
                    saisi_le?: string
                    modifie_par?: string | null
                    modifie_le?: string | null
                }
            }
            actions_correctives: {
                Row: {
                    id: string
                    reponse_id: string
                    description: string
                    priorite: string
                    assigne_a: string | null
                    date_echeance: string | null
                    statut: string
                    preuve_photo: string | null
                    faite_par: string | null
                    faite_le: string | null
                    validee_par: string | null
                    validee_le: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    reponse_id: string
                    description: string
                    priorite?: string
                    assigne_a?: string | null
                    date_echeance?: string | null
                    statut?: string
                    preuve_photo?: string | null
                    faite_par?: string | null
                    faite_le?: string | null
                    validee_par?: string | null
                    validee_le?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    reponse_id?: string
                    description?: string
                    priorite?: string
                    assigne_a?: string | null
                    date_echeance?: string | null
                    statut?: string
                    preuve_photo?: string | null
                    faite_par?: string | null
                    faite_le?: string | null
                    validee_par?: string | null
                    validee_le?: string | null
                    created_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    type: string
                    titre: string
                    message: string | null
                    data: Record<string, any>
                    lue: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: string
                    titre: string
                    message?: string | null
                    data?: Record<string, any>
                    lue?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: string
                    titre?: string
                    message?: string | null
                    data?: Record<string, any>
                    lue?: boolean
                    created_at?: string
                }
            }
        }
        Views: {
            mv_scores_sites: {
                Row: {
                    site_id: string
                    site_nom: string
                    audit_id: string | null
                    periode_debut: string | null
                    taux_conformite: number | null
                    nb_bloquants: number | null
                    p1_nc: number | null
                    p2_nc: number | null
                    en_cours: number | null
                    calcule_le: string
                }
            }
        }
        Functions: {}
        Enums: {}
    }
}

// Helper types
export type Site = Database['public']['Tables']['sites']['Row']
export type Theme = Database['public']['Tables']['themes']['Row']
export type SousTheme = Database['public']['Tables']['sous_themes']['Row']
export type Critere = Database['public']['Tables']['criteres']['Row']
export type Audit = Database['public']['Tables']['audits']['Row']
export type AuditReponse = Database['public']['Tables']['audit_reponses']['Row']
export type ActionCorrective = Database['public']['Tables']['actions_correctives']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']

// User roles
export type UserRole = 'ceo' | 'directeur' | 'qualite'

// Statuts
export type StatutCritere = 'conforme' | 'non_conforme' | 'en_cours' | 'na'
export type Priorite = 'P0' | 'P1' | 'P2' | 'P3'
