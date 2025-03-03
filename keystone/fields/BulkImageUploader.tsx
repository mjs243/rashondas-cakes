// keystone/fields/BulkImageUploader.tsx
import React, { useState } from 'react';
import { Button } from '@keystone-ui/button';
import { FieldContainer } from '@keystone-ui/fields';
import { useToasts } from '@keystone-ui/toast';

interface FileData {
  id: string;
  filename: string;
  url: string;
  mimetype: string;
  size: number;
}

interface BulkImageUploaderProps {
  field: {
    path: string;
    label: string;
  };
  value: FileData[] | null;
  onChange: (value: FileData[]) => void;
}

export const BulkImageUploader: React.FC<BulkImageUploaderProps> = ({
  field,
  value,
  onChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { addToast } = useToasts();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        return (await response.json()) as FileData;
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Update the field value with the new uploads
      onChange([...(value || []), ...uploadedFiles]);

      addToast({
        title: 'Success',
        message: `Uploaded ${files.length} images successfully`,
        tone: 'positive',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        tone: 'negative',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FieldContainer>
      <label htmlFor={`${field.path}-upload`}>{field.label}</label>
      <div>
        <input
          id={`${field.path}-upload`}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
          style={{ display: 'none' }}
        />
        <Button
          onClick={() => document.getElementById(`${field.path}-upload`)?.click()}
          isLoading={isUploading}
          tone="active"
        >
          {isUploading ? 'Uploading...' : 'Select Images'}
        </Button>

        {value && value.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {value.map((file, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <img
                  src={file.url}
                  alt={file.filename}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <Button
                  size="small"
                  tone="negative"
                  style={{ position: 'absolute', top: '4px', right: '4px' }}
                  onClick={() => {
                    onChange(value.filter((_, index) => index !== i));
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </FieldContainer>
  );
};
