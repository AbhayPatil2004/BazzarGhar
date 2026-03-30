
import StoreDetailsPage from "./components/StoreDetail";
import OwnerStores from "./components/OwnerStores";
import SimilarStores from "./components/similerStores";
import StoreReviews from "./components/StoreReviews";
import StoreProducts from "./components/StoreProducts";
import CTASection from "../../welcome/component/CTASection";

export default async function Page({ params }) {
  const { id } = await params;

  if (!id) {
    throw new Error("Store ID is missing");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/store/${id}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch store");
  }

  const result = await res.json();

  if (!result.success) {
    throw new Error("Store not found");
  }

  const { store, owner } = result.data;

  return (
    <div>
      <StoreDetailsPage store={store} owner={owner} />

      <StoreProducts storeId = {store._id} storeName = {store.storeName} ></StoreProducts>
      
      <StoreReviews storeId = {store._id} storeName = {store.storeName}></StoreReviews>
      <OwnerStores
        ownerId={owner._id}
        ownerName={owner.username}
        storeId={store._id}
      />
      <SimilarStores
        category={store.category}
        storeId={store._id}
        storeName={store.storeName}
      />

      {/* CTA Section */}
      <CTASection />

    </div>
  );
}