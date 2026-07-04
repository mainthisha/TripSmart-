const BASE_URL = 'http://127.0.0.1:8000'

// ── Helper ──
async function fetchAPI(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn(`API call failed for ${endpoint}:`, e.message)
    return { success: false, error: e.message }
  }
}

const api = {

  // ── Health ──
  health: () => fetchAPI('/health'),

  // ── Trips ──
  saveTrip: (tripData) =>
    fetchAPI('/trips/', {
      method: 'POST',
      body: JSON.stringify({
        destination: tripData.destination,
        tripDetails: tripData.tripDetails,
        activities:  tripData.activities,
        budget:      tripData.budget,
        isPublic:    true,
      }),
    }),

  getAllTrips: () => fetchAPI('/trips/'),

  getTripById: (id) => fetchAPI(`/trips/${id}`),

  getTripByCode: (code) => fetchAPI(`/trips/share/${code}`),

  updateTrip: (id, tripData) =>
    fetchAPI(`/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    }),

  deleteTrip: (id) =>
    fetchAPI(`/trips/${id}`, { method: 'DELETE' }),

  // ── Destinations ──
  getDestinations: (category = '', search = '') => {
    const params = new URLSearchParams()
    if (category && category !== 'All') params.append('category', category)
    if (search) params.append('search', search)
    return fetchAPI(`/destinations/?${params}`)
  },

  getDestinationByName: (name) =>
    fetchAPI(`/destinations/name/${encodeURIComponent(name)}`),

  // ── Weather ──
  getWeather: (destination) =>
    fetchAPI(`/weather/${encodeURIComponent(destination)}`),

  // ── Currency ──
  getCurrencyRates: () => fetchAPI('/currency/rates'),

  convertCurrency: (amount, from, to) =>
    fetchAPI(`/currency/convert?amount=${amount}&from_currency=${from}&to_currency=${to}`),

  // ── Visa ──
  getVisaInfo: (destination) =>
    fetchAPI(`/visa/${encodeURIComponent(destination)}`),

  // ── Expenses ──
  addExpense: (expense) =>
    fetchAPI('/expenses/', {
      method: 'POST',
      body: JSON.stringify(expense),
    }),

  getTripExpenses: (tripId) =>
    fetchAPI(`/expenses/trip/${tripId}`),

  deleteExpense: (id) =>
    fetchAPI(`/expenses/${id}`, { method: 'DELETE' }),
}

export default api