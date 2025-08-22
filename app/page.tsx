"use client"

import { useMemo } from "react"
import { useSuspenseQuery, gql } from "@apollo/client"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, BookOpen, User, Calendar } from "lucide-react"

const GET_BOOKS_AND_GENRES = gql`
  query GetBooksAndGenres {
    getAllBooks {
      id
      title
      author {
        id
        name
      }
      genre
      publicationYear
    }
    getAllGenres
  }
`

export default function HomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedGenre = searchParams.get("genre") || "all"

  const { data } = useSuspenseQuery(GET_BOOKS_AND_GENRES)
  const { getAllBooks: books, getAllGenres: genres } = data

  const filteredBooks = useMemo(() => {
    if (selectedGenre === "all") {
      return books
    }
    return books.filter((book: any) => book.genre === selectedGenre)
  }, [books, selectedGenre])

  const handleGenreChange = (genre: string) => {
    const params = new URLSearchParams(window.location.search)
    if (genre === "all") {
      params.delete("genre")
    } else {
      params.set("genre", genre)
    }
    router.push(`?${params.toString()}`)
  }

  const handleViewBook = (bookId: string) => {
    router.push(`/book/${bookId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-purple-900 mb-2">Books Catalog — List View</h1>
              <p className="text-lg text-purple-600">A clean, horizontal layout for quick scanning</p>
            </div>
            <Link href="/book/add">
              <Button size="lg" className="w-full lg:w-auto bg-purple-600 hover:bg-purple-700 shadow-lg">
                <Plus className="mr-2 h-5 w-5" />
                Add New Book
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8">
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <label htmlFor="genre-filter" className="text-sm font-semibold text-purple-700 whitespace-nowrap">
                  Filter by Genre:
                </label>
                <Select value={selectedGenre} onValueChange={handleGenreChange}>
                  <SelectTrigger className="w-full sm:w-[250px] bg-white">
                    <SelectValue placeholder="All Genres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    {genres.map((genre: string) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-purple-500">
                  Showing {filteredBooks.length} of {books.length} books
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Books List */}
        {filteredBooks.length > 0 ? (
          <div className="space-y-4">
            {filteredBooks.map((book: any) => (
              <Card
                key={book.id}
                className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
                      <BookOpen className="h-7 w-7 text-purple-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <CardTitle className="text-xl font-bold text-purple-900 truncate">
                              {book.title}
                            </CardTitle>
                            <Badge variant="secondary" className="text-xs px-2 py-1 bg-purple-100 text-purple-700 border-purple-200">
                              {book.genre}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-4 text-sm text-purple-600 flex-wrap">
                            <span className="inline-flex items-center gap-1">
                              <User className="h-4 w-4" /> {book.author.name}
                            </span>
                            <span className="inline-flex items-center gap-1 text-purple-500">
                              <Calendar className="h-4 w-4" /> {book.publicationYear}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewBook(book.id)}
                            className="h-9 px-3 hover:bg-purple-50 hover:text-purple-600"
                          >
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-sm border-0 bg-white/70 backdrop-blur">
            <CardContent className="py-16">
              <div className="text-center space-y-4">
                <div className="mx-auto w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-2">No books found</h3>
                  <p className="text-purple-600 mb-6">
                    {selectedGenre === "all"
                      ? "Your library is empty. Add your first book to get started!"
                      : `No books found in the "${selectedGenre}" genre.`}
                  </p>
                  <Link href="/book/add">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Book
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


