import React, { useState, useEffect } from 'react'
import { Product } from '../types'
import uniqid from 'uniqid'

interface AddProductFormProps {
  onSubmit: (product: Product | Omit<Product, 'ID'>) => Promise<void>
  initialData?: Product
  isEdit?: boolean
  onCancel?: () => void
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  onSubmit,
  initialData,
  isEdit = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    id: uniqid(),
    name: '',
    price: '',
    expirationDate: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: uniqid(),
        name: initialData.name,
        price: initialData.price,
        expirationDate: initialData.expirationDate || '',
      })
    }
  }, [initialData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && initialData) {
        await onSubmit({ ...formData, id: initialData.id })
      } else {
        await onSubmit(formData)
      }
      if (!isEdit) {
        setFormData({ id: uniqid(), name: '', price: '', expirationDate: '' })
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <input
          type="text"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expiration Date
        </label>
        <input
          type="date"
          value={formData.expirationDate}
          onChange={e =>
            setFormData({ ...formData, expirationDate: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Optional"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          {isEdit ? 'Save Changes' : 'Add Product'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default AddProductForm
