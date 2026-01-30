// 🔐 Admin Auth Helper
export interface AdminSession {
    isAdmin: boolean
    email: string
    timestamp: number
}

export function getAdminSession(): AdminSession | null {
    if (typeof window === 'undefined') return null
    
    const session = localStorage.getItem('admin_session')
    if (!session) return null
    
    try {
        const data = JSON.parse(session) as AdminSession
        // Session expires after 24 hours
        if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem('admin_session')
            return null
        }
        return data
    } catch {
        return null
    }
}

export function isAdminLoggedIn(): boolean {
    return getAdminSession() !== null
}

export function logoutAdmin(): void {
    localStorage.removeItem('admin_session')
}

// Helper to check if user is authenticated (either Supabase or Admin)
export async function getCurrentUser(supabase: any) {
    // Check admin first
    const adminSession = getAdminSession()
    if (adminSession) {
        return {
            user: {
                id: 'admin-local',
                email: adminSession.email,
                role: 'admin'
            },
            isAdmin: true
        }
    }
    
    // Check Supabase auth
    const { data: { user } } = await supabase.auth.getUser()
    return { user, isAdmin: false }
}
