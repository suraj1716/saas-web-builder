import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Landing({ testimonials }: any) {
  return (
    <AuthenticatedLayout>
    
      <Head title="Build Websites Faster" />

      <div className="min-h-screen bg-white">

        <section className="text-center py-24">
          <h1 className="text-5xl font-bold">
            Build Websites Without Code
          </h1>

          <p className="mt-4 text-gray-600">
            Launch your website in minutes using our templates.
          </p>
        </section>

        <section className="max-w-5xl mx-auto py-16">

          <h2 className="text-3xl font-bold text-center mb-10">
            What customers say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {testimonials.map((t: any) => (
              <div
                key={t.id}
                className="p-6 border rounded-lg"
              >
                <p>"{t.message}"</p>

                <div className="mt-4 font-semibold">
                  {t.name}
                </div>
              </div>
            ))}

          </div>

        </section>

      </div>
      </AuthenticatedLayout>
  );
}