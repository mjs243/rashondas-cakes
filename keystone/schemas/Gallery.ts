// Gallery.ts
import { list } from '@keystone-6/core';
import { relationship, text } from '@keystone-6/core/fields';
import { BaseListTypeInfo } from '@keystone-6/core/types';

export const Gallery = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
    },
  },
  fields: {
    name: text({ validation: { isRequired: true } }),
    description: text({ ui: { displayMode: 'textarea' } }),
    images: relationship({ ref: 'GalleryImage.gallery', many: true }),
  },
});