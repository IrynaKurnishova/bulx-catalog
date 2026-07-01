<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col">
    <!-- Image -->
    <div class="aspect-[4/3] bg-gray-100 overflow-hidden">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="normalizedTitle"
        class="w-full h-full object-cover"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex flex-col flex-1">
      <div class="flex items-start justify-between gap-2 mb-1">
        <h3
          class="font-medium text-gray-900 text-sm leading-snug"
          v-html="highlight(normalizedTitle, searchQuery)"
        />
        <span
          v-if="!product.inStock"
          class="shrink-0 text-xs text-red-500 font-medium"
        >Out of stock</span>
      </div>

      <p
        class="text-xs text-gray-400 mb-3"
        v-html="highlight(product.brand, searchQuery)"
      />

      <!-- Rating -->
      <div class="flex items-center gap-1 mb-3">
        <template v-if="product.rating !== null">
          <span class="text-yellow-400 text-xs">★</span>
          <span class="text-xs text-gray-600">{{ product.rating.toFixed(1) }}</span>
          <span class="text-xs text-gray-400">({{ product.reviews }})</span>
        </template>
        <span v-else class="text-xs text-gray-400">No reviews yet</span>
      </div>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1 mb-3">
        <span
          v-for="tag in product.tags.slice(0, 3)"
          :key="tag"
          class="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full"
        >{{ tag }}</span>
      </div>

      <!-- Price -->
      <div class="mt-auto">
        <span class="text-base font-semibold text-gray-900">
          {{ formatPrice(product.price) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../composables/useProducts'

const props = defineProps<{
  product: Product
  searchQuery: string
}>()

const parsePrice = (price: number | string | null): number | null => {
  if (price === null) return null
  if (typeof price === 'number') return price
  const cleaned = price.replace(/,/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

const formatPrice = (price: number | string | null): string => {
  const parsed = parsePrice(price)
  if (parsed === null) return 'Price on request'
  return `$${parsed.toFixed(2)}`
}

const highlight = (text: string, query: string): string => {
  if (!query.trim()) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>')
}

const normalizedTitle = props.product.title.trim()
</script>
