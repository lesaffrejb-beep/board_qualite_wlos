export interface AuditData {
    id: string
    site_id: string
    responses: Record<string, AuditResponseLocal>
    updated_at: number
}

export interface AuditResponseLocal {
    critere_id: string
    statut: 'conforme' | 'non_conforme' | 'en_cours' | 'na'
    commentaire?: string
    photos?: string[] // Base64 or local paths for now
    synced: boolean
}

const STORAGE_KEY_PREFIX = 'sv_audit_'

export const OfflineStorage = {
    saveAudit: (auditId: string, data: Partial<AuditData>) => {
        if (typeof window === 'undefined') return

        const key = `${STORAGE_KEY_PREFIX}${auditId}`
        const existing = OfflineStorage.getAudit(auditId) || {}

        const updated = {
            ...existing,
            ...data,
            updated_at: Date.now()
        }

        localStorage.setItem(key, JSON.stringify(updated))
    },

    getAudit: (auditId: string): AuditData | null => {
        if (typeof window === 'undefined') return null
        const key = `${STORAGE_KEY_PREFIX}${auditId}`
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
    },

    saveResponse: (auditId: string, response: AuditResponseLocal) => {
        const audit = OfflineStorage.getAudit(auditId) || { id: auditId, site_id: '', responses: {}, updated_at: 0 }

        audit.responses = audit.responses || {}
        audit.responses[response.critere_id] = {
            ...response,
            synced: false // Mark as dirty
        }

        OfflineStorage.saveAudit(auditId, audit)
    },

    getPendingSync: (): string[] => {
        // Return list of audit IDs that have unsynced changes
        if (typeof window === 'undefined') return []

        const keys = []
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key?.startsWith(STORAGE_KEY_PREFIX)) {
                // Check if any response is unsynced
                const data = JSON.parse(localStorage.getItem(key) || '{}')
                const hasUnsynced = Object.values(data.responses || {}).some((r: any) => !r.synced)
                if (hasUnsynced) {
                    keys.push(key.replace(STORAGE_KEY_PREFIX, ''))
                }
            }
        }
        return keys
    }
}
