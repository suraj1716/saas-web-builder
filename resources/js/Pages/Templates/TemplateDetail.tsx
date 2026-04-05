import { usePage, router, Link } from "@inertiajs/react";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Spinner } from "@/Components/Spinner";
import { TemplatePageProps } from "../../types"

const TemplateDetail: React.FC = () => {
  const { website, templateId, template } =
    usePage<TemplatePageProps>().props;

  const TRIAL_KEY = "trial_builder_data";
  const EXPIRY_KEY = "trial_builder_expiry";

  const trial =
    typeof window !== "undefined" && localStorage.getItem(TRIAL_KEY);

  const loadTrialData = () => {
    const expiry = localStorage.getItem(EXPIRY_KEY);

    if (expiry && Date.now() > Number(expiry)) {
      localStorage.removeItem(TRIAL_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      return website || {};
    }

    const stored = localStorage.getItem(TRIAL_KEY);
    if (stored) return { ...(website || {}), ...JSON.parse(stored) };

    return website || {};
  };

  const [site, setSite] = useState(() =>
    trial ? loadTrialData() : website || {}
  );

  const [activeTab, setActiveTab] = useState<
    "screenshots" | "description" | "reviews"
  >("screenshots");

  const [loading, setLoading] = useState(false);

  const buyTemplate = async () => {
    try {
      setLoading(true);

      let dataToSend = site;

      if (trial) {
        const stored = localStorage.getItem(TRIAL_KEY);
        if (stored) {
          dataToSend = { ...(website || {}), ...JSON.parse(stored) };
        }
      }

      if (!dataToSend || Object.keys(dataToSend).length === 0) {
        dataToSend = template?.data || {};
      }

      await router.post(`/templates/${templateId}/purchase`, {
        data: dataToSend,
      });

      localStorage.removeItem(TRIAL_KEY);
      localStorage.removeItem(EXPIRY_KEY);
    } catch (err) {
      console.error("Purchase failed", err);
      alert("Failed to purchase template.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthenticatedLayout>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-50">
          <Spinner text="Processing..." color="#fff" vertical />
        </div>
      )}

      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <img
              src={template?.main_screenshot || "/placeholder.png"}
              alt={template?.name}
              className="w-full rounded shadow"
            />
          </div>

          <div className="md:w-1/2 flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{template?.name}</h1>
            <p className="text-gray-600">
              {template?.short_description}
            </p>

            <div className="flex gap-2 mt-4">
              <Link
                href={`/template/${templateId}/editor/home`}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Demo
              </Link>

              <button
                onClick={buyTemplate}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Buy Template
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex border-b border-gray-300">
            {["screenshots", "description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 -mb-px font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-600"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "screenshots" && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {template?.screenshots?.map((s, i) => (
                  <img
                    key={i}
                    src={s}
                    alt={`Screenshot ${i + 1}`}
                    className="w-full rounded shadow"
                  />
                ))}
              </div>
            )}

            {activeTab === "description" && (
              <div className="prose max-w-none">
                <h2>Description</h2>
                <p>{template?.description}</p>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {template?.reviews?.length ? (
                  template.reviews.map((r, i) => (
                    <div key={i} className="border p-4 rounded shadow-sm">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">
                          {r.user_name}
                        </span>
                        <span className="text-yellow-500">
                          {"★".repeat(r.rating)}
                        </span>
                      </div>
                      <p>{r.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default TemplateDetail;