import { ColumnDef } from "@tanstack/react-table";

export type OrderTable = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  place: string;
  cart: string; // JSON string of cart items
};

type CartItem = {
  name: string;
  quantity: number;
  // Add other properties if needed
};

export const orderColumns: ColumnDef<OrderTable>[] = [
  {
    accessorKey: "firstName",
    header: "Prénom",
    cell: ({ row }) => row.getValue("firstName"),
  },
  {
    accessorKey: "lastName",
    header: "Nom de famille",
    cell: ({ row }) => row.getValue("lastName"),
  },
  {
    accessorKey: "phoneNumber",
    header: "Numéro de téléphone",
    cell: ({ row }) => row.getValue("phoneNumber"),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "place",
    header: "Adresse de livraison",
    cell: ({ row }) => row.getValue("place"),
  },
  {
    accessorKey: "cart",
    header: "Produits",
    cell: ({ row }) => {
      const cartItems = JSON.parse(row.getValue("cart"));
      return (
        <ul>
          {cartItems.map((item: CartItem, i: number) => (
            <li key={i}>
              {item.name} x {item.quantity}
            </li>
          ))}
        </ul>
      );
    },
  },
];
