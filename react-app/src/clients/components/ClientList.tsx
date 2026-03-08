import { UserOutlined } from '@ant-design/icons'
import { AppBreadcrumb } from '../../components/AppBreadcrumb'
import {
  QueryableList,
  type QueryableListQuery,
} from '../../components/QueryableList'
import {
  useClientProvider,
  type ClientSortField,
} from '../providers/useClientProvider'
import { ClientListItem } from './ClientListItem'
import { CreateClientModal } from './CreateClientModal'

export function ClientList() {
  const {
    clients,
    totalCount,
    isLoading,
    loadClients,
    deleteClient,
    updateClient,
    createClient,
  } = useClientProvider()

  const onQueryChange = (query: QueryableListQuery<ClientSortField>) => {
    loadClients({
      limit: query.limit,
      offset: query.offset,
      sortField: query.sortField,
      sortOrder: query.sortOrder,
    })
  }

  return (
    <>
      <AppBreadcrumb items={[{ title: 'Clients', icon: <UserOutlined /> }]} />
      <CreateClientModal onCreate={createClient} />
      <QueryableList<ClientSortField, (typeof clients)[number]>
        sortLabel="Sort clients by"
        initialSortField="lastName"
        initialSortOrder="ASC"
        initialPage={1}
        initialPageSize={10}
        sortOptions={[
          { value: 'lastName', label: 'Last name' },
          { value: 'firstName', label: 'First name' },
          { value: 'email', label: 'Email' },
        ]}
        onQueryChange={onQueryChange}
        items={clients}
        getItemKey={client => client.id}
        renderItem={client => (
          <ClientListItem
            client={client}
            onDelete={deleteClient}
            onUpdate={updateClient}
          />
        )}
        loading={isLoading}
        totalCount={totalCount}
        pageSizeOptions={[5, 10, 20, 50]}
        entityLabel="clients"
      />
    </>
  )
}
