import React, { useContext, useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("q")?.toLowerCase().trim() || "";
  const { products } = useContext(ShopContext);
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!searchTerm || !Array.isArray(products)) {
      setResults([]);
      return;
    }

    const filtered = products.filter((product) =>
      product.title?.toLowerCase().includes(searchTerm)
    );
    setResults(filtered);
  }, [products, searchTerm]);

  return (
    <div className="sm:px-20 px-6 py-10 min-h-screen bg-transparent">
      <h1 className="text-sm uppercase text-[#A9ABAE] mb-6 tracking-wide">
        Search Results for: "<span className="font-semibold">{searchTerm}</span>"
      </h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {results.map((product) => {
            const imageUrl =
              product.images?.edges?.[0]?.node?.url ||
              "https://via.placeholder.com/300x300?text=No+Image";
                const productId = product.id?.split("/").pop();
            return (
              <Link to={`/product/${productId}`} key={product.id} className="group">
                <div className="p-4 h-full rounded hover:shadow-md transition duration-300 ">
                  <img
                    src={imageUrl}
                    alt={product.title}
                    className="h-full m-auto object-cover rounded"
                  />
                  <h2 className="mt-3 text-[11px] uppercase text-[#A9ABAE] truncate">
                    {product.title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh] text-center">
          <p className="text-[#A9ABAE] text-sm">
            No products found for "<span className="font-semibold">{searchTerm}</span>".
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
