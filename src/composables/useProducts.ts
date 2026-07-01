import { ref, computed } from 'vue'

export interface Product {
  id: number
  title: string
  brand: string
  category: string
  tags: string[]
  price: number | string | null
  rating: number | null
  reviews: number
  inStock: boolean
  releasedAt: string
  image: string | null
  description: string | null
}

export function useProducts() {
  const products = ref<Product[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const search = ref('')
  const selectedCategory = ref('')
  const sortBy = ref('relevance')

  async function fetchProducts() {
    try {
      const res = await fetch('/api/hiring/founding-engineer/items.json')
      const data = await res.json()
      products.value = data
    } catch (e) {
      error.value = 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  function parsePrice(price: number | string | null): number | null {
    if (price === null) return null
    if (typeof price === 'number') return price
    const cleaned = price.replace(/,/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }

  function normalizeTitle(title: string): string {
    return title.trim()
  }

  const categories = computed(() => {
    const cats = new Set(products.value.map(p => p.category))
    return Array.from(cats).sort()
  })

  const filtered = computed(() => {
    let result = products.value

    if (search.value.trim()) {
      const q = search.value.trim().toLowerCase()
      result = result.filter(p => {
        const title = normalizeTitle(p.title).toLowerCase()
        const brand = p.brand.toLowerCase()
        const tags = p.tags.join(' ').toLowerCase()
        return title.includes(q) || brand.includes(q) || tags.includes(q)
      })
    }

    if (selectedCategory.value) {
      result = result.filter(p => p.category === selectedCategory.value)
    }

    if (sortBy.value === 'price-asc') {
      result = [...result].sort((a, b) => {
        const pa = parsePrice(a.price) ?? Infinity
        const pb = parsePrice(b.price) ?? Infinity
        return pa - pb
      })
    } else if (sortBy.value === 'price-desc') {
      result = [...result].sort((a, b) => {
        const pa = parsePrice(a.price) ?? -Infinity
        const pb = parsePrice(b.price) ?? -Infinity
        return pb - pa
      })
    } else if (sortBy.value === 'rating') {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    } else if (sortBy.value === 'newest') {
      result = [...result].sort((a, b) =>
        new Date(b.releasedAt).getTime() - new Date(a.releasedAt).getTime()
      )
    }

    return result
  })

  return {
    products,
    loading,
    error,
    search,
    selectedCategory,
    sortBy,
    categories,
    filtered,
    fetchProducts,
  }
}
