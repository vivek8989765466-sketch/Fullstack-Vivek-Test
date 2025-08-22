"use client"

import type React from "react"

import { useState } from "react"
import { gql, useQuery, useMutation } from "@apollo/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, BookPlus, CheckCircle, Sparkles, Plus, Palette } from "lucide-react"

const GET_AUTHORS_AND_GENRES = gql`
  query GetAuthorsAndGenres {
    getAllAuthors {
      id
      name
    }
    getAllGenres
  }
`

const ADD_BOOK = gql`
  mutation AddBook($title: String!, $authorId: ID!, $genre: String!, $publicationYear: Int!, $isbn: String!) {
    addBook(title: $title, authorId: $authorId, genre: $genre, publicationYear: $publicationYear, isbn: $isbn) {
      id
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

export default function AddBookPage() {
  const router = useRouter()
  const [formState, setFormState] = useState({
    title: "",
    authorId: "",
    genre: "",
    publicationYear: "",
    isbn: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const { data: authorsAndGenresData, loading: dataLoading } = useQuery(GET_AUTHORS_AND_GENRES)
  const [addBook, { loading: mutationLoading, error: mutationError }] = useMutation(ADD_BOOK, {
    onCompleted: () => {
      router.push("/")
    },
    refetchQueries: ["GetBooksAndGenres"],
  })

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
      addBook({
        variables: {
          ...formState,
          isbn: cleanIsbn,
          publicationYear: Number.parseInt(formState.publicationYear, 10),
        },
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Navigation */}
        <Link href="/" className="inline-flex items-center text-sm text-purple-600 hover:text-purple-900 mb-8 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Library
        </Link>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full mb-6 shadow-lg">
            <Plus className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-purple-900 mb-3">Add New Book</h1>
          <p className="text-xl text-purple-600 max-w-2xl mx-auto">Add a new book to your library collection</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-500 text-white">
            <CardTitle className="text-2xl font-bold">Book Information</CardTitle>
            <CardDescription className="text-purple-100">Fill in the details below to add a new book</CardDescription>
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
                    placeholder="Enter the book title" 
                    className={`mt-2 h-14 text-lg bg-purple-50 border-purple-200 text-purple-900 placeholder-purple-400 ${errors.title ? "border-red-500 ring-red-200" : "focus:border-purple-500 focus:ring-purple-500"}`} 
                  />
                  {errors.title && <p className="text-sm text-red-600 mt-2">{errors.title}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="authorId" className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Author *</Label>
                    <Select name="authorId" onValueChange={handleSelectChange("authorId")} value={formState.authorId}>
                      <SelectTrigger className={`mt-2 h-14 bg-purple-50 border-purple-200 text-purple-900 ${errors.authorId ? "border-red-500 ring-red-200" : "focus:border-purple-500 focus:ring-purple-500"}`}>
                        <SelectValue placeholder={dataLoading ? "Loading authors..." : "Choose an author"} />
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
                      <SelectTrigger className={`mt-2 h-14 bg-purple-50 border-purple-200 text-purple-900 ${errors.genre ? "border-red-500 ring-red-200" : "focus:border-purple-500 focus:ring-purple-500"}`}>
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
                      className={`mt-2 h-14 text-lg bg-purple-50 border-purple-200 text-purple-900 placeholder-purple-400 ${errors.publicationYear ? "border-red-500 ring-red-200" : "focus:border-purple-500 focus:ring-purple-500"}`} 
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
                      className={`mt-2 h-14 text-lg font-mono bg-purple-50 border-purple-200 text-purple-900 placeholder-purple-400 ${errors.isbn ? "border-red-500 ring-red-200" : "focus:border-purple-500 focus:ring-purple-500"}`} 
                    />
                    {errors.isbn && <p className="text-sm text-red-600 mt-1">{errors.isbn}</p>}
                  </div>
                </div>

                <div className="bg-purple-100 p-4 rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-700 text-center">Enter 13-digit ISBN (hyphens and spaces will be removed automatically)</p>
                </div>
              </div>

              {mutationError && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertDescription>
                    <strong>Error:</strong> {mutationError.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 border-t border-purple-200">
                <Link href="/">
                  <Button variant="outline" type="button" className="w-full sm:w-auto h-14 px-10 bg-transparent border-purple-400 text-purple-700 hover:bg-purple-50 hover:border-purple-500 hover:text-purple-800">
                    Cancel
                  </Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={mutationLoading || dataLoading} 
                  className="w-full sm:w-auto h-14 px-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg"
                >
                  {mutationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Adding Book...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Add Book
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


