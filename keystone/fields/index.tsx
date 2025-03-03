// // keystone/fields/index.tsx
// import React from 'react';
// import { FieldProps } from '@keystone-6/core/types';
// import { BulkImageUploader } from './BulkImageUploader';

// export const Field = ({ field, value, onChange }: FieldProps<any>) => {
//   return (
//     <BulkImageUploader
//       field={field}
//       value={value}
//       onChange={onChange}
//     />
//   );
// };

// keystone/fields/index.tsx
import React from 'react';
import { FieldProps } from '@keystone-6/core/types';
import { BulkImageUploader } from './BulkImageUploader';

// Import the FileData interface from your BulkImageUploader
interface FileData {
  id: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
}

// The Field component that Keystone will use
export const Field = ({ field, value, onChange }: FieldProps<any>) => {
  // Cast the onChange function to the right type
  const handleChange = (newValue: FileData[]) => {
    onChange?.(newValue);
  };

  return (
    <BulkImageUploader
      field={field}
      value={value as FileData[] | null}
      onChange={handleChange}
    />
  );
};