"use client";

import Papa from "papaparse";
import { useEffect, useState } from "react";
import { Category } from "./category";
import { Product } from "./product";

export function Products() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/Products.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            setProducts(results.data as never[]);
          },
          error: (error: any) => {
            console.error("Error parsing CSV:", error);
          },
        });
      })
      .catch((error) => {
        console.error("Fetch error:", error);
      });
  }, []);

  return (
    <div>
      <div className="text-center mt-6 mb-6">
        <Category onCategoryChange={setSelectedCategory} />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {products
          .filter(
            (product: any) =>
              (selectedCategory.toLowerCase() === "all" ||
                product.Category === selectedCategory) &&
              product.Id &&
              product.Picture &&
              product.Name &&
              product.Price &&
              product.Description
          )
          .map((product: any, index: number) => (
            <div key={index} className="flex flex-col h-full">
              <div className="flex flex-col flex-grow p-0">
                <Product
                  id={product.Id}
                  picture={product.Picture}
                  name={product.Name}
                  price={product.Price}
                  description={product.Description}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
