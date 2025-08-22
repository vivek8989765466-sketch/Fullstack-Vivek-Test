"use client"

import { useQuery, gql } from "@apollo/client"
import { notFound, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Calendar, User, Hash, Globe, Edit, Loader2 } from "lucide-react"

const GET_BOOK_DETAILS = gql`
  query GetBookDetails($id: ID!) {
    getBookDetails(id: $id) {
      id
      title
      genre
      publicationYear
      isbn
      author {
        id
        name
        nationality
        birthYear
      }
    }
  }
`

export default function BookDetailPage() {
  const params = useParams()
  const bookId = params.id as string

  const { data, loading, error } = useQuery(GET_BOOK_DETAILS, {
    variables: { id: bookId },
    errorPolicy: "all",
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
              <p className="text-lg text-purple-600">Loading book details...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <Link href="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-900 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to List
          </Link>
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-purple-900">Book Not Found</h2>
                <Link href="/">
                  <Button className="bg-purple-600 hover:bg-purple-700">Return to List</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const book = data?.getBookDetails

  if (!book) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Back Navigation */}
        <Link href="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-900 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to List
        </Link>

        {/* Book Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                <CardTitle className="text-3xl font-bold">{book.title}</CardTitle>
                <div className="flex items-center gap-3">
                  <Badge className="bg-white/20 text-white border-white/30 text-lg px-3 py-1">
                    {book.genre}
                  </Badge>
                  <span className="text-purple-100">Published {book.publicationYear}</span>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Author Information */}
                  <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-purple-900 mb-2">{book.author.name}</h3>
                      {book.author.nationality && (
                        <div className="flex items-center gap-2 text-purple-700 mb-1">
                          <Globe className="h-4 w-4" />
                          <span>{book.author.nationality}</span>
                        </div>
                      )}
                      {book.author.birthYear && (
                        <div className="flex items-center gap-2 text-purple-700">
                          <Calendar className="h-4 w-4" />
                          <span>Born {book.author.birthYear}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Hash className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-600 font-medium">ISBN</p>
                        <p className="text-purple-900 font-mono">{book.isbn}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Publication Year</p>
                        <p className="text-purple-900 font-semibold">{book.publicationYear}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Link href={`/book/${book.id}/edit`} className="flex-1">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3">
                        <Edit className="mr-2 h-5 w-5" />
                        Edit Book
                      </Button>
                    </Link>
                    <Link href="/" className="flex-1">
                      <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 py-3">
                        <BookOpen className="mr-2 h-5 w-5" />
                        Back to Library
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur sticky top-8">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-semibold text-purple-900 mb-1">{book.genre}</h4>
                    <p className="text-sm text-purple-600">Genre</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-2xl font-bold text-purple-900 mb-1">{book.publicationYear}</div>
                    <p className="text-sm text-purple-600">Year Published</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


