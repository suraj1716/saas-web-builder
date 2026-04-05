import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function SuccessPage() {

    return (
        <AuthenticatedLayout>

            <div className="p-10 text-center">

                <h1 className="text-4xl font-bold text-green-600">
                    Purchase Successful
                </h1>

                <p className="mt-4 text-gray-600">
                    Your website template has been added to your dashboard.
                </p>

            </div>

        </AuthenticatedLayout>
    );
}