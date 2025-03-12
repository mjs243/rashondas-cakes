// schemas/Order.ts
import { list } from '@keystone-6/core';
import { text, integer, json } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const Order = list({
  access: allowAll,
  fields: {
    items: json(),
    stripeCheckoutId: text(),
    totalPrice: integer(),
    status: text({ defaultValue: 'pending' }),
  },
});
