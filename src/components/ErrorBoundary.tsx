import { useRouteError } from 'react-router-dom'

export default function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-gray-700 mb-4">
          Sorry, an unexpected error has occurred.
        </p>
        <p className="text-gray-500">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    </div>
  )
}
