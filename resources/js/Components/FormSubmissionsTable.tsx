import { useEffect, useState } from "react";

export type FormSubmission = Record<string, any>;

type Props = {
  websiteId: number;
  formType?: string; // optional filter like "contact", "booking", "quote"
};

export default function FormSubmissionsTable({ websiteId, formType }: Props) {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch submissions
  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const query = formType ? `?type=${formType}` : "";
      const res = await fetch(`/dashboard/${websiteId}/submissions${query}`);
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, [websiteId, formType]);

  // Mark a submission as readconst csrfToken = (document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

  const csrfToken = (document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
const markAsRead = async (id: number) => {
    try {
        await fetch(`/dashboard/submissions/${id}/mark-read`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": csrfToken!, // ✅ send CSRF
            },
            body: JSON.stringify({}), // empty body
        });
        loadSubmissions();
    } catch (err) {
        console.error("Failed to mark read", err);
    }
};

  // Dynamic headers based on keys in first submission
  const headers = submissions.length
    ? Object.keys(submissions[0]).filter((k) => k !== "id") // exclude id
    : [];

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <div className="py-4 text-center">Loading...</div>
      ) : (
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">ID</th>
              {headers.map((h) => (
                <th key={h} className="px-4 py-2 border">
                  {h.replaceAll("_", " ").toUpperCase()}
                </th>
              ))}
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length === 0 && (
              <tr>
                <td colSpan={headers.length + 2} className="text-center py-4">
                  No submissions yet.
                </td>
              </tr>
            )}
            {submissions.map((s) => (
              <tr
                key={s.id}
                className={`${s.read ? "" : "bg-yellow-50"}`}
              >
                <td className="px-4 py-2 border">{s.id}</td>
                {headers.map((h) => (
                  <td key={h} className="px-4 py-2 border">
                    {typeof s[h] === "object"
                      ? JSON.stringify(s[h])
                      : s[h] ?? "-"}
                  </td>
                ))}
                <td className="px-4 py-2 border">
                  {!s.read && (
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                      onClick={() => markAsRead(s.id)}
                    >
                      Mark Read
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}