import React, { useRef, useState } from "react";

type Props = {
  content: {
    heading?: string;
    subheading?: string;
    text: string;
    imageUrl?: string;
  };
  website?: any;
  editing?: boolean;
  updateContent?: (newContent: any) => void;
};

const About: React.FC<Props> = ({ content, website, editing, updateContent }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const design = website?.design || {};
  const primaryColor = design.primaryColor || "#4f46e5";
  const bgColor = design.backgroundColor || "#f9fafb";
  const textColor = design.textColor || "#1f2937";
  const mutedColor = design.mutedColor || "#6b7280";
  const borderColor = design.borderColor || "#e5e7eb";
  const radius = design.radius || "12px";
  const sectionPadding = design.sectionPadding || "80px";
  const containerWidth = design.containerWidth || "1200px";
  const fontHeading = design.fontHeading || "Inter, sans-serif";
  const fontBody = design.fontBody || "Inter, sans-serif";

  // ========== Image Upload ==========
  const handleSelectClick = () => fileInputRef.current?.click();

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/media/upload", {
        method: "POST",
        headers: { "X-CSRF-TOKEN": token || "" },
        body: formData,
      });

      const data = await res.json();
      updateContent?.({ ...content, imageUrl: data.url });
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
  };

  return (
    <section
      className="section about"
      style={{
        padding: sectionPadding,
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: containerWidth,
          margin: "auto",
          display: "flex",
          flexDirection: "row", // horizontal stacking
          flexWrap: "wrap",
          alignItems: "center",
          gap: "24px",
        }}
      >
        {/* LEFT: Text */}
        <div style={{ flex: "1 1 400px", minWidth: "250px" }}>
          {content.heading && (
            <h2
              style={{
                fontFamily: fontHeading,
                fontSize: design.textH2 || "32px",
                color: primaryColor,
                marginBottom: "8px",
              }}
            >
              {editing ? (
                <input
                  type="text"
                  value={content.heading}
                  onChange={(e) =>
                    updateContent?.({ ...content, heading: e.target.value })
                  }
                  style={{
                    width: "100%",
                    fontSize: "32px",
                    fontFamily: fontHeading,
                    padding: "6px",
                    borderRadius: radius,
                    border: `1px solid ${borderColor}`,
                  }}
                />
              ) : (
                content.heading
              )}
            </h2>
          )}
  
          {content.subheading && (
            <h4
              style={{
                fontFamily: fontBody,
                fontSize: design.textH3 || "18px",
                color: mutedColor,
                marginBottom: "8px",
              }}
            >
              {editing ? (
                <input
                  type="text"
                  value={content.subheading}
                  onChange={(e) =>
                    updateContent?.({ ...content, subheading: e.target.value })
                  }
                  style={{
                    width: "100%",
                    fontSize: "18px",
                    fontFamily: fontBody,
                    padding: "4px",
                    borderRadius: radius,
                    border: `1px solid ${borderColor}`,
                  }}
                />
              ) : (
                content.subheading
              )}
            </h4>
          )}
  
          <div>
            {editing ? (
              <textarea
                value={content.text}
                onChange={(e) =>
                  updateContent?.({ ...content, text: e.target.value })
                }
                style={{
                  width: "100%",
                  fontFamily: fontBody,
                  fontSize: design.textBody || "16px",
                  padding: "8px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: radius,
                  minHeight: "100px",
                }}
              />
            ) : (
              <p
                style={{
                  fontFamily: fontBody,
                  fontSize: design.textBody || "16px",
                  lineHeight: 1.6,
                }}
              >
                {content.text}
              </p>
            )}
          </div>
  
          {/* MEDIA UPLOAD */}
          {editing && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={handleSelectClick}
              className="border-2 border-dashed p-3 mt-3 bg-white text-black cursor-pointer"
            >
              {uploading ? "Uploading..." : "Click or Drag & Drop Image"}
              <input
                type="file"
                accept="image/*,video/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) =>
                  e.target.files?.[0] && handleFile(e.target.files[0])
                }
              />
            </div>
          )}
        </div>
  
        {/* RIGHT: Image */}
        {content.imageUrl && (
          <div style={{ flex: "1 1 300px", minWidth: "200px" }}>
            <img
              src={content.imageUrl}
              alt="About"
              style={{
                width: "100%",
                borderRadius: radius,
                objectFit: "cover",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default About;