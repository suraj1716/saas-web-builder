import React, { useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";

/**
 * =========================
 * TYPES
 * =========================
 */
export interface Template {
  id: number;
  name: string;
  data?: {
    pages?: any[];
    layout?: any;
    design?: any;
  };
}

export interface MarketplaceProps extends PageProps {
  templates: Template[];
}

/**
 * =========================
 * SINGLE SOURCE NORMALIZER
 * =========================
 * Assumes backend is FIXED (no data.data, no pages fallback chaos)
 */
const normalizeTemplates = (templates: any[]) => {
  if (!Array.isArray(templates)) return [];

  return templates.map((tpl) => {
    const data = tpl?.data ?? {};

    return {
      id: tpl.id,
      name: tpl.name,
      data: {
        layout: data.layout ?? {},
        design: data.design ?? {},
        pages: Array.isArray(data.pages) ? data.pages : [],
      },
    };
  });
};

/**
 * =========================
 * SAFE PAGE EXTRACTOR
 * =========================
 */
const getPages = (tpl: any) => {
  return tpl?.data?.pages ?? [];
};

/**
 * =========================
 * COMPONENT
 * =========================
 */
const Marketplace: React.FC = () => {
  const { templates = [] } =
    usePage().props as unknown as MarketplaceProps;

  /**
   * normalize ONCE (no per-render loops, no duplication)
   */
  const safeTemplates = useMemo(() => {
    return normalizeTemplates(templates);
  }, [templates]);

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Marketplace
        </h2>
      }
    >
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-4">
          Marketplace
        </h1>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {safeTemplates.map((tpl) => {
            const pages = getPages(tpl);
          
            return (
              <div
                key={tpl.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold">
                  {tpl.name || "Untitled"}
                </h2>

                <p className="text-sm text-gray-500">
                  ID: {tpl.id}
                </p>

                <p className="text-sm">
                  Pages: {pages.length}
                </p>

                <Link
                  href={`/template/${tpl.id}/editor/home`}
                  className="inline-block mt-3 text-blue-600 hover:underline"
                >
                  Preview / Use →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Marketplace;