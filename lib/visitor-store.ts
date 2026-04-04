// Shared visitor data store (in production, use a database)
export const visitorData = {
  totalVisits: 0,
  uniqueVisitors: new Set<string>(),
}