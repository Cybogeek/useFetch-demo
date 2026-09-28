import { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import "./ProductList.css";

const API_URL = "https://api.escuelajs.co/api/v1/products";
const PLACEHOLDER_IMAGE = "https://placehold.co/400x400?text=No+Image";
const PAGE_SIZE = 12;   
const DEFAULT_SKELETON_COUNT = 8;

/**
 * Renders a placeholder card grid while data is loading, so the layout
 * doesn't jump once real content arrives (better perceived performance
 * than a lone spinner).
 */
function SkeletonGrid({ count }) {
  return (
    <div className="product-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div className="product-card skeleton" key={i}>
          <div className="skeleton-img" />
          <div className="skeleton-line skeleton-line--title" />
          <div className="skeleton-line skeleton-line--price" />
        </div>
      ))}
    </div>
  );
}

/**
 * ProductList
 * -----------
 * Consumes the `useFetch` hook against a demo product API and renders
 * the results in a responsive grid. This component is intentionally
 * "dumb" — it only decides what to render for each of the three states
 * (loading / error / success) and leaves all data-fetching concerns to
 * the hook.
 */
function ProductList() {
  const { data, loading, error, refetch } = useFetch(API_URL);

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [data]);

  if (loading) {
    const skeletonCount = Array.isArray(data) && data.length > 0
      ? Math.min(data.length, visibleCount)
      : DEFAULT_SKELETON_COUNT;
    return <SkeletonGrid count={skeletonCount} />;
  }

  if (error) {
    return (
      <div className="status-box error-box" role="alert">
        <p>Something went wrong: {error}</p>
        <button onClick={refetch} type="button">
          Try again
        </button>
      </div>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="status-box">
        <p>No products found.</p>
      </div>
    );
  }
const visibleItems = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  return (
    <>
      <div className="product-grid">
        {visibleItems.map((product) => 
        { 
          const imageUrl =
          Array.isArray(product.images) && product.images[0]
            ? product.images[0]
            : PLACEHOLDER_IMAGE;

        return (
          <div className="product-card" key={product.id}>
            <div className="product-card__image-wrap">
              <img
                src={imageUrl}
                alt={product.title || "Product image"}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
            <h3 className="product-card__title">{product.title}</h3>
            <p className="product-card__price">${product.price}</p>
          </div>
        );
      }
         )}
      </div>

      {hasMore && (
        <div className="load-more-wrap">
          <button
          className="load-more-button"
            type="button"
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
          >
            Load more ({data.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </>
  );
}

export default ProductList;
