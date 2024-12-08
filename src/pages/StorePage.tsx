import React, { useState, useEffect } from 'react'
import { storeService } from '../api/services'
import { Store } from '../types'

const StorePage: React.FC = () => {
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStore()
  }, [])

  const fetchStore = async () => {
    try {
      const response = await storeService.get()
      setStore(response.data)
    } catch (error) {
      console.error('Error fetching store:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInitStore = async () => {
    try {
      const response = await storeService.init()
      setStore(response.data)
    } catch (error) {
      console.error('Error initializing store:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Store</h1>
        <button
          onClick={handleInitStore}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Initialize Store
        </button>
      </div>

      {store && store.products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {store.products.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-2">Price: ${product.price}</p>
              <p className="text-gray-600">
                Expires: {product.expirationDate || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No products in store</p>
      )}
    </div>
  )
}

export default StorePage
