import axios from "axios";
import React, { useState, useRef } from "react";

type Props = {
  content: any;
  editing?: boolean;
  updateContent?: (newContent: any) => void;
};

const Hero: React.FC<Props> = ({ content, editing, updateContent }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  // Upload media (image/video)
  const handleFile = async (file: File) => {
    try {
      setUploading(true);
  
      const previewUrl = URL.createObjectURL(file);
      const type = file.type.startsWith("video") ? "video" : "image";
  
      // Show instant preview
      updateContent?.({
        ...content,
        media_url: previewUrl,
        media_type: type,
        uploading: true,
      });
  
      const formData = new FormData();
      formData.append("file", file);
  
      // CSRF token from meta tag
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
      const res = await axios.post("/media/upload", formData, {
        headers: {
          "X-CSRF-TOKEN": token || "",
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
  
      updateContent?.({
        ...content,
        media_id: res.data.id,
        media_url: res.data.url,
        media_type: res.data.type,
        uploading: false,
      });
    } catch (err) {
      console.error("Upload failed", err);
  
      updateContent?.({
        ...content,
        uploading: false,
      });
    } finally {
      setUploading(false);
    }
  };

  // Drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <section className="relative py-24 text-center text-white overflow-hidden">
      
      {/* MEDIA BACKGROUND */}
      {content.media_type === "video" ? (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        >
          <source src={content.media_url} />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${content.media_url || ""})`,
          }}
        />
      )}

      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative container mx-auto px-4">

        {/* MEDIA UPLOAD */}
        {editing && (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleSelectClick}
            className="border-2 border-dashed p-4 mb-6 bg-white text-black cursor-pointer"
          >
            {uploading
              ? "Uploading..."
              : "Click or Drag & Drop Image / Video"}

            <input
              type="file"
              accept="image/*,video/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
          </div>
        )}

        {/* HEADING */}
        <h1
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={(e) =>
            updateContent?.({
              ...content,
              heading: e.currentTarget.innerText,
            })
          }
          className={`text-4xl md:text-5xl font-bold mb-4 ${
            editing ? "outline-dashed outline-1 outline-gray-300" : ""
          }`}
        >
          {content.heading || "Your Heading"}
        </h1>

        {/* SUBHEADING */}
        <p
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={(e) =>
            updateContent?.({
              ...content,
              subheading: e.currentTarget.innerText,
            })
          }
          className={`text-lg md:text-xl mb-6 max-w-2xl mx-auto ${
            editing ? "outline-dashed outline-1 outline-gray-300" : ""
          }`}
        >
          {content.subheading || "Your subheading goes here"}
        </p>

        {/* BUTTON */}
        <a
          href={content.primary_cta_link || "#"}
          contentEditable={editing}
          suppressContentEditableWarning
          onBlur={(e) =>
            updateContent?.({
              ...content,
              primary_cta_text: e.currentTarget.innerText,
            })
          }
          className={`inline-block bg-white text-black px-6 py-3 rounded font-semibold ${
            editing ? "outline-dashed outline-1 outline-gray-300" : ""
          }`}
        >
          {content.primary_cta_text || "Click Here"}
        </a>
      </div>
    </section>
  );
};

export default Hero;