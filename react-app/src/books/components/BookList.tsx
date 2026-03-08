import { BookOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { AppBreadcrumb } from '../../components/AppBreadcrumb'
import {
  QueryableList,
  type QueryableListQuery,
} from '../../components/QueryableList'
import { API_BASE_URL } from '../../config/api'
import {
  useBookProvider,
  type BookSortField,
} from '../providers/useBookProvider'
import { BookListItem } from './BookListItem'
import { CreateBookModal } from './CreateBookModal'

export function BookList() {
  const {
    books,
    totalCount,
    isLoading,
    loadBooks,
    deleteBook,
    updateBook,
    createBook,
  } = useBookProvider()
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([])
  const [genreId, setGenreId] = useState<string | undefined>()
  const [query, setQuery] = useState<QueryableListQuery<BookSortField>>({
    sortField: 'title',
    sortOrder: 'ASC',
    page: 1,
    pageSize: 10,
    limit: 10,
    offset: 0,
  })

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/books/genres`)
      .then(res => setGenres(res.data))
      .catch(err => console.error('Failed to load genres', err))
  }, [])

  const onQueryChange = (nextQuery: QueryableListQuery<BookSortField>) => {
    setQuery(nextQuery)

    loadBooks({
      limit: nextQuery.limit,
      offset: nextQuery.offset,
      sortField: nextQuery.sortField,
      sortOrder: nextQuery.sortOrder,
      genreId,
    })
  }

  const onGenreChange = (value: string) => {
    const nextGenreId = value ? String(value) : undefined
    setGenreId(nextGenreId)

    const resetQuery: QueryableListQuery<BookSortField> = {
      ...query,
      page: 1,
      offset: 0,
    }
    setQuery(resetQuery)

    loadBooks({
      limit: resetQuery.limit,
      offset: 0,
      sortField: resetQuery.sortField,
      sortOrder: resetQuery.sortOrder,
      genreId: nextGenreId,
    })
  }

  return (
    <>
      <AppBreadcrumb items={[{ title: 'Books', icon: <BookOutlined /> }]} />
      <CreateBookModal onCreate={createBook} />

      <QueryableList<BookSortField, (typeof books)[number]>
        sortLabel="Sort books by"
        initialSortField="title"
        initialSortOrder="ASC"
        initialPage={1}
        initialPageSize={10}
        sortOptions={[
          { value: 'title', label: 'Title' },
          { value: 'authorName', label: 'Author name' },
          { value: 'yearPublished', label: 'Publish year' },
        ]}
        filterComponent={
          <Select
            value={genreId ?? ''}
            onChange={onGenreChange}
            placeholder="Filter by genre"
            style={{ width: 240 }}
            options={[
              { label: 'All genres', value: '' },
              ...genres.map(g => ({ label: g.name, value: g.id })),
            ]}
          />
        }
        onQueryChange={onQueryChange}
        items={books}
        getItemKey={book => book.id}
        renderItem={book => (
          <BookListItem
            book={book}
            onDelete={deleteBook}
            onUpdate={updateBook}
          />
        )}
        loading={isLoading}
        totalCount={totalCount}
        pageSizeOptions={[5, 10, 20, 50]}
        entityLabel="books"
      />
    </>
  )
}
