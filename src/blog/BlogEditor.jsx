import React, { useState, useRef, useMemo, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import imageCompression from "browser-image-compression";
import axiosInstance from "../api/axios";

const BlogEditor = ({
  onSubmit,
  initialContent = "",
  initialTitle = "",
  isEditMode = false,
}) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    if (isEditMode) {
      setTitle(initialTitle);
      setContent(initialContent);
    }
  }, [initialContent, initialTitle, isEditMode]);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      setIsLoading(true);
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920 };
      const compressedFile = await imageCompression(file, options);
      const formData = new FormData();
      formData.append("image", compressedFile);

      try {
        const res = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        });

        const data = res.data;
        if (data.url) {
          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);
          editor.insertEmbed(range.index, "image", data.url);
        } else {
          throw new Error("Image upload failed: No URL returned");
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in title and content");
      return;
    }

    const div = document.createElement("div");
    div.innerHTML = content;
    const firstImg = div.querySelector("img");
    const thumbnail = firstImg ? firstImg.getAttribute("src") : null;

    try {
      await onSubmit({ title, content, thumbnail });

      if (!isEditMode) {
        alert("Blog saved!");
        setTitle("");
        setContent("");
      } else {
        alert("Blog updated!");
      }
    } catch (err) {
      console.error("Error submitting blog:", err);
      alert("Submission failed");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 flex flex-col min-h-[70vh]">
      <div className="sticky top-0 bg-white z-20 border-b border-gray-300 mb-3 py-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 border border-gray-300 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex-grow mb-3 border border-gray-300 rounded-md overflow-y-auto" style={{ height: "65vh" }}>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          placeholder="Write your blog..."
          ref={quillRef}
          style={{ height: "100%" }}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center mb-3 text-sm text-gray-500">
          Uploading image...
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {content.replace(/<[^>]+>/g, "").trim().split(/\s+/).filter(Boolean).length || 0} words
        </span>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition"
          disabled={isLoading}
        >
          {isEditMode ? "Cập nhật" : "Đăng bài"}
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
