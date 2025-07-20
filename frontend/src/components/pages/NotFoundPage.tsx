import { Link } from 'react-router-dom'
import { HomeIcon } from '@heroicons/react/24/outline'

export default function NotFoundPage() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-slate-300 dark:text-slate-600 mb-4">
          404
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Page Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="btn btn-primary"
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  )
}
