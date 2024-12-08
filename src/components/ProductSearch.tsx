import React, { useState } from 'react'
import { Product } from '../types'

interface ProductSearchProps {
  onSearch: (id: string) => Promise<void>
  searchResult: Product | null
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  onSearch,
  searchResult,
}) => {
  const [searchId, setSearchId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchId.trim()) {
      await onSearch(searchId)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchId}
          onChange={e => setSearchId(e.target.value)}
          placeholder="Enter product ID"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
        >
          Search
        </button>
      </form>

      {searchResult && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-2">{searchResult.name}</h3>
          <p className="text-gray-600">ID: {searchResult.id}</p>
          <p className="text-gray-600">Price: ${searchResult.price}</p>
          <p className="text-gray-600">
            Expires: {searchResult.expirationDate || 'N/A'}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductSearch
