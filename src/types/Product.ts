export interface Product {
  id: string
  name: string
  price: string
  expirationDate: string
}

// Optional: Create a type for product creation without ID
export type CreateProductDTO = Omit<Product, 'id'>
