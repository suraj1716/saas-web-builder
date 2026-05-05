import React, { useState } from "react";
import axios from "axios";
import { SectionInstance, WebsiteInstance } from "@/web-builder/types/types";

// -----------------------------
// TYPES
// -----------------------------
type FieldType =
  | "text"
  | "email"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "file";

type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
};

type FileValue = { url: string; media_id: number };
type FormValue = string | string[] | FileValue;

function isFileValue(value: FormValue): value is FileValue {
  return typeof value === "object" && value !== null && "url" in value;
}

type Props = {
  content: any;
  editing?: boolean;
  updateContent?: (newContent: any) => void;
  websiteId?: string | number;
  sectionId?: string;
  website?: WebsiteInstance;
  section?: SectionInstance;
  trial?: boolean;
};

// -----------------------------
// FILE UPLOAD ZONE
// -----------------------------
const FileUploadZone: React.FC<{
  value: FormValue | undefined;
  onUpload: (val: FileValue) => void;
}> = ({ value, onUpload }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const csrfToken = (
        document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement
      )?.content;
      const res = await fetch("/media/upload", {
        method: "POST",
        headers: { "X-CSRF-TOKEN": csrfToken! },
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onUpload({ url: data.url, media_id: data.id });
    } catch {
      alert("Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  const uploaded = value && isFileValue(value) ? value : null;

  return (
    <div
      className="file-zone"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <div className="file-icon">{uploading ? "⏳" : "📎"}</div>
      <div className="file-text">
        {uploading ? (
          "Uploading…"
        ) : uploaded ? (
          <>File uploaded — <strong>click to replace</strong></>
        ) : (
          <><strong>Click to upload</strong> or drag & drop</>
        )}
      </div>
      {uploaded && (
        <a
          href={uploaded.url}
          target="_blank"
          rel="noopener noreferrer"
          className="file-uploaded"
          onClick={(e) => e.stopPropagation()}
        >
          ✓ View file
        </a>
      )}
    </div>
  );
};

// -----------------------------
// MAIN COMPONENT
// -----------------------------
const Contact: React.FC<Props> = ({
  websiteId,
  sectionId,
  trial = false,
  content,
  editing,
  updateContent,
}) => {
  const safeContent = Array.isArray(content) ? {} : (content ?? {});
  const [formData, setFormData] = useState<Record<string, FormValue>>({});
  const [success, setSuccess] = useState(false);

  const fields: Field[] = safeContent.fields || [
    { name: "name",    label: "Name",    type: "text",     required: true },
    { name: "email",   label: "Email",   type: "email",    required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
  ];

  const handleChange = (name: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    try {
      if (trial) {
        if (!sectionId) throw new Error("Missing sectionId");
        const key = `trial_form_${sectionId}`;
        const existing: Record<string, FormValue>[] = JSON.parse(
          localStorage.getItem(key) || "[]"
        );
        localStorage.setItem(key, JSON.stringify([...existing, formData]));
      } else {
        if (!websiteId || !sectionId)
          throw new Error("Missing websiteId or sectionId");
        await axios.post(`/forms/submit/${websiteId}/${sectionId}`, {
          data: formData,
        });
      }
      setSuccess(true);
      setFormData({});
    } catch (err: any) {
      console.error("Form submission failed:", err.response || err);
      alert("Failed to submit form. Make sure you are logged in.");
    }
  };

  type FieldKeys = "name" | "label" | "type" | "options";

  const updateField = (index: number, key: FieldKeys, value: string | string[]) => {
    const newFields = [...fields];
    switch (key) {
      case "options":
        newFields[index].options = value as string[];
        break;
      case "name":
      case "label":
        newFields[index][key] = value as string;
        break;
      case "type":
        if (["text","email","textarea","select","radio","checkbox","file"].includes(value as string)) {
          newFields[index].type = value as FieldType;
        }
        break;
    }
    updateContent?.({ ...safeContent, fields: newFields });
  };

  const addField = () => {
    const newField: Field = { name: `field_${Date.now()}`, label: "New Field", type: "text" };
    updateContent?.({ ...safeContent, fields: [...fields, newField] });
  };

  const deleteField = (index: number) => {
    updateContent?.({ ...safeContent, fields: fields.filter((_, i) => i !== index) });
  };

  // ──────────────────────────────────────
  // EDIT MODE
  // ──────────────────────────────────────
  if (editing) {
    return (
      <div className="edit-wrap">
        <div className="edit-panel">

          <div className="edit-header">
            <div className="edit-header-icon">📋</div>
            <div>
              <h3>Contact Form</h3>
              <p>Customize fields and settings</p>
            </div>
          </div>

          <p className="edit-section-label">Form Title</p>
          <input
            className="edit-input"
            placeholder="e.g. Get in touch"
            value={safeContent.title || ""}
            onChange={(e) => updateContent?.({ ...safeContent, title: e.target.value })}
          />

          <p className="edit-section-label">Subtitle</p>
          <input
            className="edit-input"
            placeholder="A short description shown under the title"
            value={safeContent.subtitle || ""}
            onChange={(e) => updateContent?.({ ...safeContent, subtitle: e.target.value })}
          />

          <p className="edit-section-label">Button Label</p>
          <input
            className="edit-input"
            placeholder="e.g. Send message"
            value={safeContent.submitLabel || ""}
            onChange={(e) => updateContent?.({ ...safeContent, submitLabel: e.target.value })}
          />

          <p className="edit-section-label">Success Message</p>
          <input
            className="edit-input"
            placeholder="e.g. Thanks! We'll be in touch soon."
            value={safeContent.successMessage || ""}
            onChange={(e) => updateContent?.({ ...safeContent, successMessage: e.target.value })}
          />

          <div className="divider" />

          <p className="edit-section-label">Fields ({fields.length})</p>

          {fields.map((field, i) => (
            <div className="field-card" key={i}>
              <div className="field-row">
                <input
                  className="field-label-input"
                  placeholder="Field label"
                  value={field.label}
                  onChange={(e) => updateField(i, "label", e.target.value)}
                />
                <select
                  className="field-type-select"
                  value={field.type}
                  onChange={(e) => updateField(i, "type", e.target.value as FieldType)}
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                  <option value="radio">Radio</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="file">File</option>
                </select>
                <button
                  type="button"
                  className="field-delete-btn"
                  onClick={() => deleteField(i)}
                  title="Remove field"
                >
                  ×
                </button>
              </div>

              {(field.type === "select" || field.type === "radio" || field.type === "checkbox") && (
                <input
                  className="options-input"
                  placeholder="Options: Option A, Option B, Option C"
                  value={field.options?.join(", ") || ""}
                  onChange={(e) =>
                    updateField(i, "options", e.target.value.split(",").map((o) => o.trim()).filter(Boolean))
                  }
                />
              )}
            </div>
          ))}

          <button type="button" className="add-btn" onClick={addField}>
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Add field
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────
  // VIEW MODE
  // ──────────────────────────────────────
  return (
    <section className="section">
      <div className="container">
        <div className="inner">

          <div className="eyebrow">Contact</div>

          <h2 className="heading h2">
            {safeContent.title || "Get in touch"}
          </h2>

          <p className="subtitle">
            {safeContent.subtitle ||
              "We'd love to hear from you. Send us a message and we'll get back to you as soon as possible."}
          </p>

          <div className="card card-lg">
            {success && (
              <div className="form-success">
                <div className="form-success-icon">✓</div>
                {safeContent.successMessage || "Thanks! We'll be in touch soon."}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {fields.map((field, i) => (
                <div className="field-group" key={i}>
                  <label className="label">
                    {field.label}
                    {field.required && <span className="required">*</span>}
                  </label>

                  {field.type === "file" && (
                    <FileUploadZone
                      value={formData[field.name]}
                      onUpload={(val) => handleChange(field.name, val)}
                    />
                  )}

                  {field.type === "textarea" && (
                    <textarea
                      className="textarea"
                      value={(formData[field.name] as string) || ""}
                      required={field.required}
                      placeholder={`Enter ${field.label.toLowerCase()}…`}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  )}

                  {field.type === "select" && (
                    <select
                      className="select"
                      value={(formData[field.name] as string) || ""}
                      required={field.required}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    >
                      <option value="">Choose an option…</option>
                      {field.options?.map((opt, j) => (
                        <option key={j} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {field.type === "radio" && (
                    <div className="radio-group">
                      {field.options?.map((opt, j) => (
                        <label key={j} className="radio-option">
                          <input
                            type="radio"
                            name={field.name}
                            value={opt}
                            checked={formData[field.name] === opt}
                            onChange={(e) => handleChange(field.name, e.target.value)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === "checkbox" && (
                    <div className="checkbox-group">
                      {field.options?.map((opt, j) => (
                        <label key={j} className="checkbox-option">
                          <input
                            type="checkbox"
                            name={`${field.name}[]`}
                            value={opt}
                            checked={(formData[field.name] as string[] | undefined)?.includes(opt) || false}
                            onChange={(e) => {
                              const prev = (formData[field.name] as string[]) || [];
                              handleChange(
                                field.name,
                                e.target.checked ? [...prev, opt] : prev.filter((v) => v !== opt)
                              );
                            }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  )}

                  {["text", "email", "number"].includes(field.type) && (
                    <input
                      className="input"
                      type={field.type}
                      value={(formData[field.name] as string) || ""}
                      required={field.required}
                      placeholder={field.type === "email" ? "you@example.com" : `Enter ${field.label.toLowerCase()}…`}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                    />
                  )}
                </div>
              ))}

              <button type="submit" className="button button-full">
                {safeContent.submitLabel || "Send message →"}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;