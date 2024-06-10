"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { useCart } from "./cartContext";
import { IconParkOutlineShoppingBagOne } from "./cartIcon";
import { CommandDialog } from "./commandDialog";

export function Cart() {
  const { cart, getTotalQuantity, removeItem, updateItemQuantity } = useCart();

  const handleQuantityChange = (id: string, quantity: string) => {
    updateItemQuantity(id, parseInt(quantity));
  };

  return (
    <div className="text-center ml-32">
      <Drawer>
        <DrawerTrigger>
          <div className="relative inline-flex items-center cursor-pointer">
            <IconParkOutlineShoppingBagOne />
            <span className="text-white bg-red-500 rounded-full w-6 h-6 flex items-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
              {cart.length > 0 ? getTotalQuantity() : 0}
            </span>
          </div>
        </DrawerTrigger>
        <DrawerContent className="w-2/3 mx-auto px-10">
          <DrawerHeader>
            <DrawerTitle>Contenu du panier</DrawerTitle>
            <DrawerDescription>
              Vérifiez vos articles avant de passer commande.
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
            {cart.length > 0 ? (
              <ul>
                {cart.map((item, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center mb-2 border p-2 rounded-lg"
                  >
                    <div className="flex items-center w-full">
                      <div className="flex-1 text-left font-semibold">
                        {item.name}
                      </div>
                      <div className="text-green-600 font-semibold mx-2">
                        {item.price} €
                      </div>
                      <div className="flex items-center mx-2">
                        <span className="text-gray-500 mr-2">Quantité :</span>
                        <Select
                          value={item.quantity.toString()}
                          onValueChange={(value: string) =>
                            handleQuantityChange(item.id, value)
                          }
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="Quantité" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Quantité</SelectLabel>
                              {[...Array(10).keys()].map((i) => (
                                <SelectItem key={i} value={(i + 1).toString()}>
                                  {i + 1}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <Trash2
                        className="w-8 h-8 ml-4 rounded-lg p-1 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          removeItem(item.id);
                        }}
                      />
                    </div>
                  </li>
                ))}
                <li className="text-lg">
                  <span className="font-semibold">Total :</span>{" "}
                  <span className="text-green-600 font-semibold">
                    {cart.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    )}{" "}
                    €
                  </span>
                  {" - "}
                  <span className="text-gray-500">
                    Quantité : {getTotalQuantity()}
                  </span>
                </li>
              </ul>
            ) : (
              <p>Panier vide</p>
            )}
          </div>
          <DrawerFooter className="w-full">
            <CommandDialog />
            <DrawerClose className="w-1/3 mx-auto">Fermer</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
