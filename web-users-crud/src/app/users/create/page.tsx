import { USERS } from '@/config/api';
import ClientUserForm from '../UserForm';

const CreateUser = () => {
    return <ClientUserForm submitUrl={USERS} />;
};

export default CreateUser;
