// import { list } from '@keystone-6/core';
// import { text, timestamp, image } from '@keystone-6/core/fields';
// import { allowAll } from '@keystone-6/core/access';

// export const GalleryImage = list({
//   access: allowAll, // adjust based on your needs
//   fields: {
//     title: text({ validation: { isRequired: true } }),
//     description: text({ ui: { displayMode: 'textarea' } }),
//     image: image({
//       storage: 'galleryImages',
//       ui: {
//         // Cast the custom views object to any to bypass type-checking issues.
//         views: {
//           Create: require.resolve('../fields/BulkImageUploader'),
//           Field: require.resolve('../fields/BulkImageUploader'),
//           ItemCardValue: require.resolve('../fields/BulkImageUploader'),
//         } as any,
//       },
//     }),
//     uploadedAt: timestamp({ defaultValue: { kind: 'now' } }),
//   },
// });


// keystone/schemas/GalleryImage.ts
import { list } from '@keystone-6/core';
import { text, timestamp, image, json } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';
import path from 'path';

export const GalleryImage = list({
  access: allowAll,
  fields: {
    title: text({ validation: { isRequired: true } }),
    description: text({ ui: { displayMode: 'textarea' } }),
    
    // For the standard image field
    image: image({
      storage: 'galleryImages',
    }),
    
    // For your bulk uploader
    galleryImages: json({
      ui: {
        views: './fields', // Relative path from schemas directory
      },
    }),
    
    uploadedAt: timestamp({ defaultValue: { kind: 'now' } }),
  },
});