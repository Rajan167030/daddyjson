/**
 * Admin utility functions
 */

const ADMIN_EMAILS = ["rajan@mail.com", "Rajan167"]

/**
 * Check if a user is an admin
 * @param identifier - Email or username to check
 * @returns true if the identifier is in the admin list
 */
export function isAdmin(identifier: string | null | undefined): boolean {
  if (!identifier) return false
  return ADMIN_EMAILS.includes(identifier)
}

/**
 * Get list of admin identifiers
 */
export function getAdminList(): string[] {
  return ADMIN_EMAILS
}
