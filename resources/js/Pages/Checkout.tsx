import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function CheckoutPage() {

    return (
        <AuthenticatedLayout>

            <div className="p-10">

                <h1 className="text-3xl font-bold">
                    Checkout
                </h1>

                <div className="mt-8">
                    Payment form will be here
                </div>

            </div>

        </AuthenticatedLayout>
    );
}