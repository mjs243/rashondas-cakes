import { list } from '@keystone-6/core';
import { text, password } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const User = list({
    access: allowAll,
    fields: {
        name: text({ validation: { isRequired: true } }),
        email: text({ isIndexed: 'unique', validation: { isRequired: true } }),
        password: password({ validation: { isRequired: true } }),
    },
});