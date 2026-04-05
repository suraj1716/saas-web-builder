import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react"; // import router
import { useState } from "react";
import FormSubmissionsTable from "@/Components/FormSubmissionsTable";

export default function Dashboard() {
  const { websites } = usePage().props as any;

  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("Contact");

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
      <Head title="Dashboard" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">

              {/* Website List */}
              {!selectedWebsite && (
                <div>
                  <h1 className="text-2xl font-bold mb-4">My Websites</h1>
                  <div className="grid grid-cols-3 gap-6">
                  {websites.map((site: any) => {
    // Add this to debug
    console.log("Website:", site.id, site.data, site.data?.pages);

    return (
        <div
            key={site.id}
            className="border p-4 rounded shadow cursor-pointer hover:shadow-md"
            onClick={() => setSelectedWebsite(site)}
        >
            <h3 className="font-semibold">{site.name}</h3>

            {/* This is where the error occurs */}
            <p>Pages: {site.data.pages.length}</p>

            {/* Buttons */}
            <div className="mt-2 flex gap-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.get(`/websites/${site.id}/settings`);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Settings
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.get(`/builder/${site.id}`);
                    }}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Edit Site
                </button>
            </div>
        </div>
    );
})}
                  </div>
                </div>
              )}

              {/* Selected Website View */}
              {selectedWebsite && (
                <div>
                  <button
                    onClick={() => setSelectedWebsite(null)}
                    className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    ← Back to My Websites
                  </button>

                  <h2 className="text-xl font-bold mb-2">{selectedWebsite.name}</h2>

                  {/* Tabs */}
                  <div className="flex gap-4 border-b mb-4">
                    {["Contact", "Booking", "Quote"].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 border-b-2 ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-600 hover:text-gray-800"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Submissions Table */}
                  <FormSubmissionsTable
                    websiteId={selectedWebsite.id}
                    formType={activeTab.toLowerCase()}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}