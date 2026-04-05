import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function UserSites() {

    return (
        <AuthenticatedLayout>

            <div className="p-10">

                <h1 className="text-3xl font-bold">
                    My Websites
                </h1>

                <div className="mt-8">
                    User cloned sites appear here
                </div>

            </div>

        </AuthenticatedLayout>
    );
}