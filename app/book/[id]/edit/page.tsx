"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookOpen, CheckCircle, Loader2, Edit3, Zap, Palette, Sparkles, Target } from "lucide-react"

const GET_BOOK_FOR_EDIT = gql`
  query GetBookForEdit($id: ID!) {
    getBookDetails(id: $id) {
      id
      title
      genre
      publicationYear
      isbn
      author {
        id
        name
      }
    }
  }
`

const GET_AUTHORS_AND_GENRES = gql`
  query GetAuthorsAndGenres {
    getAllAuthors {
      id
      name
    }
    getAllGenres
  }
`

const UPDATE_BOOK = gql`
  mutation UpdateBook($id: ID!, $title: String, $authorId: ID, $genre: String, $publicationYear: Int, $isbn: String) {
    updateBook(id: $id, title: $title, authorId: $authorId, genre: $genre, publicationYear: $publicationYear, isbn: $isbn) {
      id
      title
      genre
      publicationYear
      isbn
      author { id name }
    }
  }
`

const GENRE_OPTIONS = [
  "Sci-Fi",
  "Fantasy",
  "Mystery",
  "Horror",
  "Romance",
  "Thriller",
  "Biography",
  "History",
  "Self-Help",
  "Business",
  "Science",
  "Philosophy",
  "Poetry",
  "Drama",
  "Comedy",
  "Adventure",
  "Political Satire",
  "Non-Fiction",
  "Children",
  "Young Adult",
]

export default function EditBookPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  const [formState, setFormState] = useState({
    title: "",
    authorId: "",
    genre: "",
    publicationYear: "",
    isbn: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const { data: bookData, loading: bookLoading, error: bookError } = useQuery(GET_BOOK_FOR_EDIT, {
    variables: { id: bookId },
    errorPolicy: "all",
  })
  const { data: authorsAndGenresData, loading: dataLoading } = useQuery(GET_AUTHORS_AND_GENRES)

  const [updateBook, { loading: mutationLoading, error: mutationError }] = useMutation(UPDATE_BOOK, {
    onCompleted: () => {
      router.push(`/book/${bookId}`)
    },
    refetchQueries: ["GetBooksAndGenres", "GetBookDetails"],
  })

  useEffect(() => {
    if (bookData?.getBookDetails) {
      const book = bookData.getBookDetails
      setFormState({
        title: book.title,
        authorId: book.author.id,
        genre: book.genre,
        publicationYear: book.publicationYear.toString(),
        isbn: book.isbn,
      })
    }
  }, [bookData])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formState.title.trim()) newErrors.title = "Title is required."
    if (!formState.authorId) newErrors.authorId = "Author is required."
    if (!formState.genre) newErrors.genre = "Genre is required."
    const year = Number.parseInt(formState.publicationYear, 10)
    if (!formState.publicationYear) newErrors.publicationYear = "Publication year is required."
    else if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
      newErrors.publicationYear = `Year must be between 1000 and ${new Date().getFullYear()}.`
    }
    if (!formState.isbn.trim()) newErrors.isbn = "ISBN is required."
    else if (!/^\d{13}$/.test(formState.isbn.replace(/[-\s]/g, ""))) {
      newErrors.isbn = "ISBN must be 13 digits (hyphens and spaces will be removed)."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const cleanIsbn = formState.isbn.replace(/[-\s]/g, "")
      updateBook({
        variables: {
          id: bookId,
          title: formState.title,
          authorId: formState.authorId,
          genre: formState.genre,
          publicationYear: Number.parseInt(formState.publicationYear, 10),
          isbn: cleanIsbn,
        },
      })
    }
  }

  if (bookLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
              <p className="text-lg text-purple-600">Loading book data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (bookError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <Link href="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-900 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
          <Card className="bg-purple-800/50 border-purple-600 text-white">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500">
              <CardTitle className="text-2xl font-bold">Error Loading Book</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-purple-200 mb-4">Failed to load book data. Please try again.</p>
              <Link href="/">
                <Button className="bg-purple-600 hover:bg-purple-700">Return to Library</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!bookData?.getBookDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="container mx-auto px-6 py-8 max-w-6xl">
          <Link href="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-900 mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Library
          </Link>
          <Card className="bg-purple-800/50 border-purple-600 text-white">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500">
              <CardTitle className="text-2xl font-bold">Book Not Found</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-purple-200 mb-4">The book you're looking for doesn't exist.</p>
              <Link href="/">
                <Button className="bg-purple-600 hover:bg-purple-700">Return to Library</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Navigation */}
        <Link href={`/book/${bookId}`} className="inline-flex items-center text-sm text-purple-600 hover:text-purple-900 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Book Details
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl mb-6 shadow-lg">
            <Target className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-purple-900 mb-3">Edit Book</h1>
          <p className="text-xl text-purple-600 max-w-2xl mx-auto">Update the information for "{bookData.getBookDetails.title}"</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-purple-800/50 border-purple-600 text-white">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500">
                <CardTitle className="flex items-center gap-3 text-lg font-bold">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Palette className="h-5 w-5" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-purple-700/50 rounded-lg">
                    <Sparkles className="h-4 w-4 text-purple-300" />
                    <span className="text-sm">Edit Mode Active</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-700/50 rounded-lg">
                    <Edit3 className="h-4 w-4 text-purple-300" />
                    <span className="text-sm">Form Validation</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-700/50 rounded-lg">
                    <Zap className="h-4 w-4 text-purple-300" />
                    <span className="text-sm">Auto-save Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Edit3 className="h-6 w-6" />
                  </div>
                  Edit Book Information
                </CardTitle>
                <CardDescription className="text-purple-100">Update the book details below</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title" className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Book Title *</Label>
                      <Input 
                        id="title" 
                        name="title" 
                        value={formState.title} 
                        onChange={handleChange} 
                        placeholder="Enter book title" 
                        className={`mt-2 h-14 text-lg bg-purple-50 border-purple-200 text-purple-900 placeholder-purple-400 ${errors.title ? "border-red-500 ring-red-500" : "focus:border-purple-500 focus:ring-purple-500"}`} 
                      />
                      {errors.title && <p className="text-sm text-red-600 mt-2">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="authorId" className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Author *</Label>
                        <Select name="authorId" onValueChange={handleSelectChange("authorId")} value={formState.authorId}>
                          <SelectTrigger className={`mt-2 h-14 bg-purple-50 border-purple-200 text-purple-900 ${errors.authorId ? "border-red-500 ring-red-500" : "focus:border-purple-500 focus:ring-purple-500"}`}>
                            <SelectValue placeholder={dataLoading ? "Loading authors..." : "Select an author"} />
                          </SelectTrigger>
                          <SelectContent className="bg-purple-50 border-purple-200">
                            {authorsAndGenresData?.getAllAuthors.map((author: any) => (
                              <SelectItem key={author.id} value={author.id} className="text-purple-900 hover:bg-purple-100">{author.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.authorId && <p className="text-sm text-red-600 mt-2">{errors.authorId}</p>}
                      </div>

                      <div>
                        <Label htmlFor="genre" className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Genre *</Label>
                        <Select name="genre" onValueChange={handleSelectChange("genre")} value={formState.genre}>
                          <SelectTrigger className={`mt-2 h-14 bg-purple-50 border-purple-200 text-purple-900 ${errors.genre ? "border-red-500 ring-red-500" : "focus:border-purple-500 focus:ring-purple-500"}`}>
                            <SelectValue placeholder="Select a genre" />
                          </SelectTrigger>
                          <SelectContent className="bg-purple-50 border-purple-200">
                            {GENRE_OPTIONS.map((genre) => (
                              <SelectItem key={genre} value={genre} className="text-purple-900 hover:bg-purple-100">{genre}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.genre && <p className="text-sm text-red-600 mt-2">{errors.genre}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="publicationYear" className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Publication Year *</Label>
                        <Input 
                          id="publicationYear" 
                          name="publicationYear" 
                          type="number" 
                          min="1000" 
                          max={new Date().getFullYear()} 
                          value={formState.publicationYear} 
                          onChange={handleChange} 
                          placeholder="e.g., 2023" 
                          className={`mt-2 h-14 text-lg bg-purple-50 border-purple-200 text-purple-900 placeholder-purple-400 ${errors.publicationYear ? "border-red-500 ring-red-500" : "focus:border-purple-500 focus:ring-purple-500"}`} 
                        />
                        {errors.publicationYear && <p className="text-sm text-red-600 mt-2">{errors.publicationYear}</p>}
                      </div>

                      <div>
                        <Label htmlFor="isbn" className="text-sm font-semibold text-purple-700 uppercase tracking-wide">ISBN *</Label>
                        <Input 
                          id="isbn" 
                          name="isbn" 
                          value={formState.isbn} 
                          onChange={handleChange} 
                          placeholder="978-0-123456-78-9" 
                          className={`mt-2 h-14 text-lg font-mono bg-purple-50 border-purple-200 text-purple-900 placeholder-purple-400 ${errors.isbn ? "border-red-500 ring-red-500" : "focus:border-purple-500 focus:ring-purple-500"}`} 
                        />
                        {errors.isbn && <p className="text-sm text-red-600 mt-1">{errors.isbn}</p>}
                      </div>
                    </div>

                    <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
                      <p className="text-xs text-purple-700 text-center">Enter 13-digit ISBN (hyphens and spaces will be removed automatically)</p>
                    </div>
                  </div>

                  {mutationError && (
                    <Alert variant="destructive" className="border-red-800 bg-red-900/50 text-red-200">
                      <AlertDescription>
                        <strong>Error:</strong> {mutationError.message}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-purple-200">
                    <Link href={`/book/${bookId}`}>
                      <Button variant="outline" type="button" className="w-full sm:w-auto h-14 px-10 bg-transparent border-purple-400 text-purple-700 hover:bg-purple-50 hover:border-purple-500 hover:text-purple-800">
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      disabled={mutationLoading || dataLoading} 
                      className="w-full sm:w-auto h-14 px-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold shadow-lg"
                    >
                      {mutationLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Updating Book...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Update Book
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


