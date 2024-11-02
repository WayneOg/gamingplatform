// For `pages/404.js` or `app/404/page.js`

import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-8">Oops! The page you are looking for does not exist.</p>

      <div className="flex space-x-4">
        <Link href="/">
          <a className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition">
            Go to Homepage
          </a>
        </Link>
        <Link href="/contact">
          <a className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition">
            Contact Support
          </a>
        </Link>
      </div>

      <div className="mt-12 text-sm text-gray-400">
        <p>Need help? Check out our <Link href="/faq"><a className="underline">FAQ</a></Link> or <Link href="/support"><a className="underline">Support Page</a></Link>.</p>
      </div>
    </div>
  );
}
