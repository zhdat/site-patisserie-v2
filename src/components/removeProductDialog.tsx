"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
  Id: string;
  Name: string;
  Price: number;
  Description: string;
  Picture: string;
}

export function RemoveProductDialog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched products:", data);
        setProducts(data);
        setFilteredProducts(data); // Initialize with all products
      });
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product: { Name: string }) =>
        product.Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleRemove = async () => {
    if (!selectedProductId) return;

    const response = await fetch(
      `http://localhost:3001/delete-product/${selectedProductId}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      alert("Produit supprimé avec succès");
      const updatedProducts = products.filter(
        (product: { Id: any }) => product.Id !== selectedProductId
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts); // Update filteredProducts
      setSelectedProductId(null); // Reset the selected product after deletion
      setOpen(false); // Close the popover after deletion
    } else {
      alert("Erreur lors de la suppression du produit");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-1/3 mx-auto">Supprimer un produit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer un produit</DialogTitle>
          <DialogDescription>
            Veuillez sélectionner un produit à supprimer.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedProductId
                  ? products.find(
                      (product: { Id: any }) => product.Id === selectedProductId
                    )?.Name
                  : "Sélectionner un produit..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                />
                <CommandList>
                  <ScrollArea className="h-72">
                    {filteredProducts.length === 0 ? (
                      <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                    ) : (
                      <CommandGroup>
                        {filteredProducts.map(
                          (product: { Name: any; Id: any }, index: any) => (
                            <CommandItem
                              key={index}
                              value={product.Name}
                              onSelect={() => {
                                setSelectedProductId(
                                  product.Id === selectedProductId
                                    ? null
                                    : product.Id
                                );
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProductId === product.Id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product.Name}
                            </CommandItem>
                          )
                        )}
                      </CommandGroup>
                    )}
                  </ScrollArea>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleRemove}
            disabled={!selectedProductId}
          >
            Supprimer le produit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
