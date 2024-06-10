import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "./cartContext";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

export function Product({
  id,
  picture,
  name,
  price,
  description,
}: {
  id: string;
  picture: string;
  name: string;
  price: number;
  description: string;
}) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Produit ajouté au panier ✅",
      description: (
        <p>
          Le produit <strong>{name}</strong> a été ajouté à votre panier.
        </p>
      ),
    });
    addItem({
      id,
      name,
      price,
      picture,
      description,
      quantity: 1,
    });
  };

  return (
    <div className="h-full">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-green-600 font-semibold mb-4 text-lg">{price} €</p>
          <Image
            src={"/" + picture}
            alt="photo produit"
            width={300}
            height={300}
            className="mx-auto rounded-lg"
          />
        </CardContent>
        <CardFooter className="mt-auto flex justify-center">
          <Button
            className="bg-gray-700"
            onClick={() => {
              handleAddToCart();
            }}
          >
            Ajouter au panier
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
