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
  | "file"; // <-- added file

type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
};

type FileValue = { url: string; media_id: number };
type FormValue = string | string[] | FileValue;

// Type guard for file values
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
// COMPONENT
// -----------------------------
const Contact: React.FC<Props> = ({
  websiteId,
  sectionId,
  trial = false,
  content,
  editing,
  updateContent,
}) => {
  const [formData, setFormData] = useState<Record<string, FormValue>>({});
  const [success, setSuccess] = useState(false);

  const fields: Field[] = content.fields || [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "message", label: "Message", type: "textarea", required: true },
  ];

  // -----------------------------
  // FORM DATA HANDLERS
  // -----------------------------
  const handleChange = (name: string, value: FormValue) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);

    try {
      if (trial) {
        if (!sectionId) throw new Error("Missing sectionId for trial form");
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

  // -----------------------------
  // FIELD UPDATES
  // -----------------------------
  type FieldKeys = "name" | "label" | "type" | "options";

  const updateField = (
    index: number,
    key: FieldKeys,
    value: string | string[]
  ) => {
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
        // Narrow value to FieldType safely
        if (
          value === "text" ||
          value === "email" ||
          value === "textarea" ||
          value === "select" ||
          value === "radio" ||
          value === "checkbox" ||
          value === "file"
        ) {
          newFields[index].type = value;
        } else {
          console.warn(`Invalid type value: ${value}`);
        }
        break;
    }
  
    updateContent?.({ ...content, fields: newFields });
  };

  const uploadFile = async (file: File) => {
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

    return await res.json(); // returns { id, url, type }
  };

  const addField = () => {
    const newField: Field = {
      name: `field_${fields.length + 1}`,
      label: "New Field",
      type: "text",
    };
    updateContent?.({ ...content, fields: [...fields, newField] });
  };

  const deleteField = (index: number) => {
    updateContent?.({ ...content, fields: fields.filter((_, i) => i !== index) });
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <section style={{ padding: 40 }}>
      {editing ? (
        <div>
          <h3>Contact Form Settings</h3>

          <input
            placeholder="Form Title"
            value={content.title || ""}
            onChange={(e) =>
              updateContent?.({ ...content, title: e.target.value })
            }
            style={{ display: "block", marginBottom: 10 }}
          />

          <h4>Fields</h4>

          {fields.map((field, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <input
                value={field.label}
                onChange={(e) => updateField(i, "label", e.target.value)}
              />
              <select
                value={field.type}
                onChange={(e) =>
                  updateField(i, "type", e.target.value as FieldType)
                }
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
                <option value="radio">Radio</option>
                <option value="checkbox">Checkbox</option>
                <option value="file">File</option>
              </select>

              {(field.type === "select" ||
                field.type === "radio" ||
                field.type === "checkbox") && (
                <input
                  placeholder="Options (comma separated)"
                  value={field.options?.join(",") || ""}
                  onChange={(e) =>
                    updateField(
                      i,
                      "options",
                      e.target.value.split(",").map((o) => o.trim())
                    )
                  }
                  style={{ display: "block", marginTop: 4 }}
                />
              )}

              <button
                type="button"
                onClick={() => deleteField(i)}
                style={{ marginTop: 4 }}
              >
                Delete Field
              </button>
            </div>
          ))}

          <button type="button" onClick={addField}>
            Add Field
          </button>
        </div>
      ) : (
        <div>
          <h2>{content.title || "Contact Us"}</h2>
          {success && <p>{content.successMessage || "Form submitted!"}</p>}

          <form onSubmit={handleSubmit}>
            {fields.map((field, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <label className="block font-medium mb-1">{field.label}</label>

                {/* FILE INPUT */}
                {field.type === "file" && (
  <div>
    <input
      type="file"
      onChange={async (e) => {
        if (!e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        try {
          const uploaded = await uploadFile(file);
          handleChange(field.name, { url: uploaded.url, media_id: uploaded.id });
        } catch (err) {
          console.error("File upload failed", err);
          alert("Failed to upload file.");
        }
      }}
    />

    {/* --- NEW PART --- */}
    {(() => {
      const value = formData[field.name]; // <-- assign to local variable
      if (isFileValue(value)) {           // <-- type guard
        return (
          <div className="mt-2">
            <a
              href={value.url}           // ✅ safe to access .url
              target="_blank"
              className="text-blue-500 underline"
            >
              View Uploaded File
            </a>
          </div>
        );
      }
      return null;
    })()}
  </div>
)}

                {/* TEXTAREA */}
                {field.type === "textarea" && (
                  <textarea
                    value={(formData[field.name] as string) || ""}
                    required={field.required}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                )}

                {/* SELECT */}
                {field.type === "select" && (
                  <select
                    value={(formData[field.name] as string) || ""}
                    required={field.required}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    {field.options?.map((opt, j) => (
                      <option key={j} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* RADIO */}
                {field.type === "radio" &&
                  field.options?.map((opt, j) => (
                    <label key={j} className="mr-4">
                      <input
                        type="radio"
                        name={field.name}
                        value={opt}
                        checked={formData[field.name] === opt}
                        onChange={(e) =>
                          handleChange(field.name, e.target.value)
                        }
                        className="mr-1"
                      />
                      {opt}
                    </label>
                  ))}

                {/* CHECKBOX */}
                {field.type === "checkbox" &&
                  field.options?.map((opt, j) => (
                    <label key={j} className="mr-4">
                      <input
                        type="checkbox"
                        name={`${field.name}[]`}
                        value={opt}
                        checked={
                          (formData[field.name] as string[] | undefined)?.includes(
                            opt
                          ) || false
                        }
                        onChange={(e) => {
                          const prev = (formData[field.name] as string[]) || [];
                          if (e.target.checked)
                            handleChange(field.name, [...prev, opt]);
                          else
                            handleChange(
                              field.name,
                              prev.filter((v) => v !== opt)
                            );
                        }}
                        className="mr-1"
                      />
                      {opt}
                    </label>
                  ))}

                {/* DEFAULT INPUTS (text, email, number, etc.) */}
                {["text", "email", "number"].includes(field.type) && (
                  <input
                    type={field.type}
                    value={(formData[field.name] as string) || ""}
                    required={field.required}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full border rounded px-2 py-1"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Contact;