import React, { useState, useEffect } from 'react';
import { productService } from '../api/services';
import { Product } from '../types';
import AddProductForm from '../components/AddProductForm';
import Modal from '../components/Modal';
import { useTracing } from '../hooks/useTracing';
import { SpanKind } from '@opentelemetry/api';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { startSpan, endSpan } = useTracing();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const filterProducts = () => {
    const filtered = products.filter(product => 
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const fetchProducts = async () => {
    const span = startSpan('fetchProducts', {
      kind: SpanKind.CLIENT,
      attributes: {
        'operation.type': 'read',
        'operation.name': 'fetch_all_products',
      },
    });

    try {
      setLoading(true);
      setError(null);
      const response = await productService.getAll();
      setProducts(response.data);
      setFilteredProducts(response.data);
      endSpan(span);
    } catch (error) {
      endSpan(span, error as Error);
      setError('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData: Omit<Product, 'ID'>) => {
    const span = startSpan('addProduct', {
      kind: SpanKind.CLIENT,
      attributes: {
        'operation.type': 'create',
        'operation.name': 'add_product',
        'product.name': productData.id,
      },
    });

    try {
      setError(null);
      const response = await productService.create(productData);
      setProducts([...products, response.data]);
      setIsAddModalOpen(false);
      endSpan(span);
    } catch (error) {
      endSpan(span, error as Error);
      setError('Failed to add product');
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (productData: Product) => {
    const span = startSpan('editProduct', {
      kind: SpanKind.CLIENT,
      attributes: {
        'operation.type': 'edit',
        'operation.name': 'edit_product',
        'product.name': productData.id,
      },
    });
    try {
      setError(null);
      const response = await productService.update(productData.id, productData);
      setProducts(products.map(p => p.id === productData.id ? response.data : p));
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      endSpan(span);
    } catch (error) {
      endSpan(span, error as Error);
      setError('Failed to update product');
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const span = startSpan('deleteProduct', {
      kind: SpanKind.CLIENT,
      attributes: {
        'operation.type': 'delete',
        'operation.name': 'delete_product',
        'product.id': id,
      },
    });
    try {
      setError(null);
      await productService.delete(id);
      setProducts(products.filter(p => p.id !== id));
      endSpan(span);
    } catch (error) {
      endSpan(span, error as Error);
      setError('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add Product
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products by ID, name, or price..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-1">ID: {product.id}</p>
                <p className="text-gray-800 font-medium mb-1">Price: ${product.price}</p>
                <p className="text-gray-600 text-sm">
                  Expires: {product.expirationDate || 'N/A'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsEditModalOpen(true);
                  }}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
      >
        <AddProductForm 
          onSubmit={handleAddProduct}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Edit Product"
      >
        {selectedProduct && (
          <AddProductForm 
            onSubmit={handleEditProduct}
            initialData={selectedProduct}
            isEdit
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </Modal>

      {filteredProducts.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No products found matching your search.
        </div>
      )}
    </div>
  );
};

export default ProductsPage;