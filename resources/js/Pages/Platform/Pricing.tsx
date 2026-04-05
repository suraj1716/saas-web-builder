import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";

function subscribe(priceId: string) {
    router.post(route("subscribe"), {
        price_id: priceId,
    });
}

export default function Pricing({ plans }: any) {
    return (
        <AuthenticatedLayout>
            <Head title="Pricing" />

            <div className="max-w-6xl mx-auto py-20">

                <h1 className="text-4xl font-bold text-center mb-12">
                    Pricing
                </h1>

                <div className="grid md:grid-cols-3 gap-8">

                    {plans.map((plan: any) => (

                        <div
                            key={plan.name}
                            className="border rounded-xl p-8 shadow-sm hover:shadow-md transition"
                        >
                            <h2 className="text-2xl font-bold">
                                {plan.name}
                            </h2>

                            <p className="text-3xl mt-4 font-semibold">
                                ${plan.price}
                                <span className="text-sm text-gray-500"> / month</span>
                            </p>

                            <ul className="mt-6 space-y-2 text-gray-600">
                                {plan.features.map((f: string) => (
                                    <li key={f}>✓ {f}</li>
                                ))}
                            </ul>

                            <button
                                onClick={() => subscribe(plan.price_id)}
                                className="mt-8 w-full rounded-md bg-black text-white py-2 hover:bg-gray-800"
                            >
                                Subscribe
                            </button>

                        </div>

                    ))}

                </div>

            </div>
        </AuthenticatedLayout>
    );
}