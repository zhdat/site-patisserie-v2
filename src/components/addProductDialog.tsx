"use client";

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
import { useEffect, useState } from "react";

export function AddProductDialog() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState("");
  const [category, setCategory] = useState("");

  const generateId = () => {
    const date = new Date();
    return date.getTime().toString();
  };

  useEffect(() => {
    setId(generateId());
  }, []);

  const handleSubmit = async () => {
    const response = await fetch("http://localhost:3001/add-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        picture,
        name,
        price,
        description,
        category,
      }),
    });

    if (response.ok) {
      alert("Produit ajouté avec succès");
    } else {
      alert("Erreur lors de l'ajout du produit");
    }
    window.location.reload();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const formData = new FormData();
      formData.append("image", event.target.files[0]);

      const response = await fetch("http://localhost:3001/upload-image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPicture(data.imageUrl);
      } else {
        alert("Erreur lors du téléchargement de l'image");
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-1/3 mx-auto">Ajouter un produit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un produit</DialogTitle>
          <DialogDescription>
            Veuillez renseigner les informations suivantes pour ajouter un
            nouveau produit.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              ID
            </Label>
            <Input
              id="id"
              placeholder="ID"
              className="col-span-3"
              value={id}
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input
              id="name"
              placeholder="Nom"
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              Prix
            </Label>
            <Input
              id="price"
              placeholder="Prix"
              className="col-span-3"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Description"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Image
            </Label>
            <Input
              type="file"
              id="picture"
              className="col-span-3"
              onChange={handleImageUpload}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="picture" className="text-right">
              Image
            </Label>
            <Input
              id="picture"
              placeholder="URL de l'image"
              className="col-span-3"
              value={picture}
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Catégorie
            </Label>
            <Input
              id="category"
              placeholder="Catégorie"
              className="col-span-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Ajouter le produit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
