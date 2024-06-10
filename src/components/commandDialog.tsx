import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCart } from "./cartContext"; // Assurez-vous d'importer le contexte du panier

export function CommandDialog() {
  const { cart } = useCart(); // Récupérer le contenu du panier
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [place, setPlace] = useState("");

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:3001/submit-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastName,
        firstName,
        phoneNumber,
        email,
        place,
        cart, // Ajouter le contenu du panier à la requête
      }),
    });

    if (response.ok) {
      alert("Commande passée avec succès");
    } else {
      alert("Erreur lors de la soumission de la commande");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-1/3 mx-auto">Passer la commande</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Informations</DialogTitle>
          <DialogDescription>
            Veuillez renseigner les informations suivantes pour passer votre
            commande.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Nom
            </Label>
            <Input
              id="lastName"
              placeholder="Nom"
              className="col-span-3"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              Prénom
            </Label>
            <Input
              id="firstName"
              placeholder="Prénom"
              className="col-span-3"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">
              Téléphone
            </Label>
            <Input
              id="phoneNumber"
              placeholder="Numéro de téléphone"
              className="col-span-3"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              E-mail
            </Label>
            <Input
              id="email"
              placeholder="Adresse e-mail"
              className="col-span-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="place" className="text-right">
              Lieu de livraison
            </Label>
            <Input
              id="place"
              placeholder="Adresse de livraison"
              className="col-span-3"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Passer commande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
