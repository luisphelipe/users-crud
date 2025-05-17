import { USERS } from '@/config/api';
import ClientUserForm from '../../UserForm';
import axios from 'axios';

interface Props {
    params: { id: string };
}

const UpdateUser = async ({ params }: Props) => {
    const { id } = await params;

    // const access_token = (await cookies()).get('access_token')?.value;

    // if (!access_token) redirect('/users');

    const { data } = await axios.get(`${USERS}/${id}`);

    const submitUrl = `${USERS}/${id}`;

    return <ClientUserForm initialData={data} submitUrl={submitUrl} isUpdate={true} />;
};

export default UpdateUser;
