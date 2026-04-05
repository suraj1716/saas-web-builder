// src/pages/Marketplace.tsx
import React from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";

// Template type
export interface Template {
  id: number;
  name: string;
  data?: {
    pages?: any[];
  };
}

// Page props
export interface MarketplaceProps extends PageProps {
  templates: Template[];
}

const Marketplace: React.FC = () => {
  const { templates } = usePage().props as unknown as MarketplaceProps;

  const page = usePage();
  
  console.log("FULL PAGE OBJECT:", page);
  console.log("PROPS ONLY:", page.props);
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Marketplace
        </h2>
      }
    >
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{tpl.name}</h2>
              <p className="text-sm text-gray-500">ID: {tpl.id}</p>
              <p className="text-sm">
                Pages: {tpl.data?.pages?.length ?? 0}
              </p>

              <Link
                href={`/template/${tpl.id}/editor/home`}
                className="inline-block mt-3 text-blue-600 hover:underline"
              >
                Preview / Use →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Marketplace;