import React, { useState, useRef, useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';
import axiosInstance from '../api/axios';

const BlogEditor = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setIsLoading(true);
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920 };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append('image', compressedFile);

      try {
        const res = await axiosInstance.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, 
        });
      
        const data = res.data; 
      
        if (data.url) {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, 'image', data.url);
        } else {
          throw new Error('Image upload failed: No URL returned');
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in title and content');
      return;
    }
  
    try {
      const user = JSON.parse(localStorage.getItem('user'));
  
      const div = document.createElement('div');
      div.innerHTML = content;
      const firstImg = div.querySelector('img');
      const thumbnail = firstImg ? firstImg.getAttribute('src') : null;
  
      const res = await axiosInstance.post('/blog', {
        title,
        content,
        author: user.id,
        thumbnail, 
      });
  
      alert('Blog saved!');
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Error saving blog:', err);
      alert('Failed to save blog');
    }
  };
  
  

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
        <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full mb-12 p-2 border border-gray-300 rounded-md"
        />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        modules={modules}
        placeholder="Write your blog..."
        ref={quillRef}
        className="mt-4"
      />
      {isLoading && (
        <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
          Uploading image...
        </div>
      )}

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-gray-600">
          {content.replace(/<[^>]+>/g, '').trim().split(/\s+/).length || 0} words
        </span>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          disabled={isLoading}
        >
          Publish
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
