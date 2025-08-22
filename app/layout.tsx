import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ApolloProvider } from "@/lib/apollo-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Book Library - Purple Theme",
  description: "A beautiful purple-themed book library application",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProvider>
          <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
              <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-white">Book Library</h1>
                      <p className="text-sm text-purple-200">Purple Theme</p>
                    </div>
                  </div>
                  <nav className="flex items-center gap-6">
                    <a href="/" className="text-purple-100 hover:text-white transition-colors">Home</a>
                    <a href="/book/add" className="text-purple-100 hover:text-white transition-colors">Add Book</a>
                   
                  </nav>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-purple-700 to-purple-800 text-white py-8 mt-16">
              <div className="container mx-auto px-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-lg font-semibold">Book Library</span>
                  </div>
                  <p className="text-purple-200 mb-4">Purple Theme Version</p>
                  <div className="flex items-center justify-center gap-6 text-sm text-purple-300">
                    <a href="/" className="hover:text-white transition-colors">Home</a>
                    <a href="/book/add" className="hover:text-white transition-colors">Add Book</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </ApolloProvider>
      </body>
    </html>
  )
}
