// src/components/BlogForm.tsx
import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';

interface BlogFormProps {
  initialData?: {
    title: string;
    content: string;
    imageUrl?: string; // New field
  };
  onSubmit: (data: {
    title: string;
    content: string;
    imageUrl?: string;
  }) => void;
  onCancel: () => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
}

const BlogForm: React.FC<BlogFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  submitButtonText = 'Submit',
  isSubmitting = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || ''); // New state

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setImageUrl(initialData.imageUrl || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
      <div className='grid gap-2'>
        <Label htmlFor='title'>Title</Label>
        <Input
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='My Awesome Blog Post'
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='content'>Content</Label>
        <Textarea
          id='content'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Write your blog content here...'
          rows={8}
          required
        />
      </div>
      <div className='grid gap-2'>
        <Label htmlFor='imageUrl'>Image URL</Label>
        <Input
          id='imageUrl'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder='e.g., https://example.com/image.jpg'
        />
      </div>
      <div className='flex justify-end gap-2 mt-4'>
        <Button
          type='button'
          variant='outline'
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default BlogForm;
