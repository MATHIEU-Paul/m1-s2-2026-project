import { TeamOutlined } from '@ant-design/icons'
import { AppBreadcrumb } from '../../components/AppBreadcrumb'
import {
  QueryableList,
  type QueryableListQuery,
} from '../../components/QueryableList'
import {
  useAuthorProvider,
  type AuthorSortField,
} from '../providers/useAuthorProvider'
import { AuthorListItem } from './AuthorListItem'
import { CreateAuthorModal } from './CreateAuthorModal'

export function AuthorList() {
  const { authors, totalCount, loadAuthors, deleteAuthor, createAuthor } =
    useAuthorProvider()

  const onQueryChange = (query: QueryableListQuery<AuthorSortField>) => {
    loadAuthors({
      limit: query.limit,
      offset: query.offset,
      sortField: query.sortField,
      sortOrder: query.sortOrder,
    })
  }

  return (
    <>
      <AppBreadcrumb items={[{ title: 'Authors', icon: <TeamOutlined /> }]} />
      <CreateAuthorModal onCreate={createAuthor} />
      <QueryableList<AuthorSortField, (typeof authors)[number]>
        sortLabel="Sort authors by"
        initialSortField="lastName"
        initialSortOrder="ASC"
        initialPage={1}
        initialPageSize={10}
        sortOptions={[
          { value: 'lastName', label: 'Last name' },
          { value: 'firstName', label: 'First name' },
        ]}
        onQueryChange={onQueryChange}
        items={authors}
        getItemKey={author => author.id}
        renderItem={author => (
          <AuthorListItem author={author} onDelete={deleteAuthor} />
        )}
        totalCount={totalCount}
        pageSizeOptions={[5, 10, 20, 50]}
        entityLabel="authors"
      />
    </>
  )
}
