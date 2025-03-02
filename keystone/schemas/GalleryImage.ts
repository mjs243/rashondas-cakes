import { list } from '@keystone-6/core';
import { text, timestamp, image } from '@keystone-6/core/fields';
import { allowAll } from '@keystone-6/core/access';

export const GalleryImage = list({
    access: allowAll,
    fields: {
        title: text({ validation: { isRequired: true } }),
        description: text({
            ui: {
                displayMode: 'textarea',
            },
        }),
        image: image({
            storage: 'galleryImages',
        }),
        uploadedAt: timestamp({ defaultValue: { kind: 'now' } }),
    }
});