
export type UserRole = 'owner' | 'trainer' | 'member'

export interface AuthFormProps {
  role: UserRole
}
