export interface User {
  ID: string
  name: string
  age: string
  email: string
  password: string
}

// Optional: Create a type for user creation without ID
export type CreateUserDTO = Omit<User, 'ID'>
