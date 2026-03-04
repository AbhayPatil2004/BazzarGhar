
import StoreDetailsPage from "./components/StoreDetail";
import OwnerStores from "./components/OwnerStores";
import SimilarStores from "./components/similerStores";

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
    </div>
  );
}