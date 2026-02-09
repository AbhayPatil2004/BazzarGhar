export default function UpdateProductHeader() {
    return (
        <div className="mb-10 p-6 md:p-8 bg-white rounded-2xl border shadow-sm md:mx-10 md:mt-10 mx-5 mt-20 ">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Update product Details
            </h1>

            <p className="text-gray-500 mt-3 max-w-2xl leading-relaxed">
                Modify your product information including branding, products, address,
                and description. Make sure all details are accurate before saving.
            </p>

            <div className="mt-6 border-b"></div>
        </div>
    );
}
