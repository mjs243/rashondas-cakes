// GalleryImage.ts
import { list } from '@keystone-6/core';
import { relationship, text, image } from '@keystone-6/core/fields';
import { BaseListTypeInfo } from '@keystone-6/core/types';

export const GalleryImage = list({
  access: {
    operation: {
      query: () => true,
      create: () => true,
      update: () => true,
      delete: () => true,
    },
  },
  fields: {
    altText: text(),
    image: image({ storage: 'galleryImages' }),
    gallery: relationship({ ref: 'Gallery.images' }),
  },
});