import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

const User = list({
    // access:
    // ui:
    fields: {
        email: text({ isRequired: true, isUnique: true }),
        password: password({ isRequired: true }),
    },
});

export default User;
