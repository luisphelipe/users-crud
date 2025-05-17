import { fetchUsers } from '@/lib/fetchUsers';
import UserList from './UserList';

const UsersList = async () => {
    const initialData = await fetchUsers();

    return <UserList initialData={initialData} />;
};

export default UsersList;
