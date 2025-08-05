import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';

export default function ClientError() {
  const error = useRouteError();

  let message = 'An unexpected error occurred';
  if (isRouteErrorResponse(error)) {
    // thrown by React Router loaders/actions
    message = `${error.status} – ${error.statusText}`;
  } else if (error instanceof Error) {
    // any other JS Error
    message = error.message;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-2 text-red-600">Something went wrong</h1>
      <p className="mb-4 text-lg text-gray-700">{message}</p>
      <Link
        to="/client"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}