import { list } from '@keystone-6/core';
import { text, integer, checkbox, relationship, image, float, decimal } from '@keystone-6/core/fields';
// import { cloudinaryImage } from '@keystone-6/cloudinary';
import { allowAll } from '@keystone-6/core/access';

export const Product = list({
    access: allowAll,
    fields: {
        name: text({ validation: { isRequired: true } }),
        price: integer({ 
            validation: { isRequired: true },
            defaultValue: 0,
         }),
        description: text({
            ui: {
                displayMode: 'textarea',
            },
        }),
        isFeatured: checkbox({ defaultValue: false }),
        productImage: image({
            storage: 'localImages',
        }),
        // categories: relationship({
        //     ref: 'Category.products',
        //     many: true,
        // }),
    },
    ui: {
        listView: {
            initialColumns: ['name', 'price', 'isFeatured'],
            pageSize: 10,
        }
    }
});