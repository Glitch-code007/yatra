import { Trip, TripJournalEntry } from "@/types"

const STORAGE_KEY_TRIPS = "yatra_saved_trips"
const STORAGE_KEY_JOURNAL = "yatra_trip_journal"
const STORAGE_KEY_SAVED_PLACES = "yatra_saved_places"

export class TripStorageService {
  /**
   * Save or update a trip to LocalStorage (with Supabase fallback capability)
   */
  static saveTrip(trip: Trip): Trip {
    if (typeof window === "undefined") return trip

    try {
      const existing = this.getAllTrips()
      const index = existing.findIndex((t) => t.id === trip.id)
      if (index >= 0) {
        existing[index] = { ...trip, updatedAt: new Date().toISOString() }
      } else {
        existing.unshift({ ...trip, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      }
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(existing))
    } catch (e) {
      console.error("Failed to save trip to localStorage", e)
    }

    return trip
  }

  /**
   * Get all saved trips
   */
  static getAllTrips(): Trip[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(STORAGE_KEY_TRIPS)
      return data ? JSON.parse(data) : []
    } catch (e) {
      console.error("Failed to read trips from localStorage", e)
      return []
    }
  }

  /**
   * Get a single trip by ID
   */
  static getTripById(id: string): Trip | null {
    const trips = this.getAllTrips()
    return trips.find((t) => t.id === id) || null
  }

  /**
   * Delete a trip by ID
   */
  static deleteTrip(id: string): boolean {
    if (typeof window === "undefined") return false
    try {
      const existing = this.getAllTrips()
      const filtered = existing.filter((t) => t.id !== id)
      localStorage.setItem(STORAGE_KEY_TRIPS, JSON.stringify(filtered))
      return true
    } catch (e) {
      console.error("Failed to delete trip", e)
      return false
    }
  }

  /**
   * Journal Entries (Expenses, Photos, Notes, Visited Locations)
   */
  static addJournalEntry(tripIdOrEntry: string | TripJournalEntry, maybeEntry?: Omit<TripJournalEntry, "id" | "tripId" | "createdAt">): TripJournalEntry {
    let tripId = typeof tripIdOrEntry === "string" ? tripIdOrEntry : tripIdOrEntry.tripId
    let entryData = typeof tripIdOrEntry === "string" ? (maybeEntry || {}) : tripIdOrEntry

    const newEntry: TripJournalEntry = {
      ...entryData,
      id: (entryData as any).id || `jrn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tripId,
      createdAt: (entryData as any).createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as TripJournalEntry

    if (typeof window !== "undefined") {
      try {
        const allEntries = this.getAllJournalEntries()
        allEntries.unshift(newEntry)
        localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(allEntries))

        // Also update actual total cost on the parent trip if it's an expense
        if (newEntry.entryType === "expense" && newEntry.expenseAmountInr) {
          const trip = this.getTripById(tripId)
          if (trip) {
            trip.actualCostInr = (trip.actualCostInr || 0) + newEntry.expenseAmountInr
            this.saveTrip(trip)
          }
        }
      } catch (e) {
        console.error("Failed to record journal entry", e)
      }
    }

    return newEntry
  }

  /**
   * Get all journal entries for a specific trip or all trips
   */
  static getJournalEntries(tripId?: string): TripJournalEntry[] {
    if (!tripId) return this.getAllJournalEntries()
    return this.getJournalEntriesByTrip(tripId)
  }

  static getJournalEntriesByTrip(tripId: string): TripJournalEntry[] {
    const all = this.getAllJournalEntries()
    return all.filter((e) => e.tripId === tripId)
  }

  private static getAllJournalEntries(): TripJournalEntry[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(STORAGE_KEY_JOURNAL)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }

  /**
   * Bookmark / Saved Places Management
   */
  static toggleSavedPlace(place: { id: string; name: string; category: string; destinationSlug: string; imageUrl?: string }): boolean {
    if (typeof window === "undefined") return false
    try {
      const data = localStorage.getItem(STORAGE_KEY_SAVED_PLACES)
      let list: any[] = data ? JSON.parse(data) : []
      const exists = list.some((p) => p.id === place.id)

      if (exists) {
        list = list.filter((p) => p.id !== place.id)
        localStorage.setItem(STORAGE_KEY_SAVED_PLACES, JSON.stringify(list))
        return false // removed
      } else {
        list.push({ ...place, savedAt: new Date().toISOString() })
        localStorage.setItem(STORAGE_KEY_SAVED_PLACES, JSON.stringify(list))
        return true // added
      }
    } catch {
      return false
    }
  }

  static getSavedPlaces(): any[] {
    if (typeof window === "undefined") return []
    try {
      const data = localStorage.getItem(STORAGE_KEY_SAVED_PLACES)
      return data ? JSON.parse(data) : []
    } catch {
      return []
    }
  }
}
