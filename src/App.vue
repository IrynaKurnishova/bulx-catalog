<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products, brands, materials..."
              class="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              @input="onSearch"
            />
          </div>

          <!-- Category filter -->
          <select
            v-model="selectedCategory"
            class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="">All categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <!-- Sort -->
          <select
            v-model="sortBy"
            class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main -->
    <div class="max-w-7xl mx-auto px-4 py-6">
      <!-- Title + count -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Home Goods</h1>
        <span class="text-sm text-gray-500">
          {{ filtered.length }} of {{ products.length }} products
        </span>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="n in 12" :key="n" class="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
          <div class="aspect-[4/3] bg-gray-200" />
          <div class="p-4 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4" />
            <div class="h-3 bg-gray-200 rounded w-1/2" />
            <div class="h-4 bg-gray-200 rounded w-1/4 mt-4" />
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20 text-red-500">{{ error }}</div>

      <!-- Empty -->
      <div v-else-if="filtered.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg">No products found for "{{ search }}"</p>
        <button
          class="mt-4 text-sm text-gray-900 underline"
          @click="search = ''; selectedCategory = ''"
        >Clear filters</button>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in filtered"
          :key="product.id"
          :product="product"
          :search-query="search"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProducts } from './composables/useProducts'
import ProductCard from './components/ProductCard.vue'

const { products, loading, error, search, selectedCategory, sortBy, categories, filtered, fetchProducts } = useProducts()

let debounceTimer: ReturnType<typeof setTimeout>

const onSearch = (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    search.value = val
  }, 300)
}

onMounted(() => {
  fetchProducts()
})
</script>
