import bodyParser from "body-parser";
import cors from "cors";
import csv from "csv-parser";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import express from "express";
import fs, { existsSync } from "fs";
import multer from "multer";
import { createTransport } from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import pkg from "xlsx";

const { readFile, utils, writeFile } = pkg;

const app = express();
const port = 3001;

app.use(bodyParser.json());

// Configurer CORS pour permettre les requêtes depuis localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST, DELETE, PUT",
    allowedHeaders: "Content-Type",
  })
);

// Configure Nodemailer
const transporter = createTransport({
  service: "gmail",
  auth: {
    user: "calliste.ravix@gmail.com",
    pass: "phkv rzob cnqu rgyn",
  },
});

const productsFilePath = "../../public/Products.csv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vérifiez si le fichier CSV existe, sinon créez-le avec un en-tête
if (!fs.existsSync(productsFilePath)) {
  const csvWriter = createCsvWriter({
    path: productsFilePath,
    header: [
      { id: "id", title: "ID" },
      { id: "picture", title: "Picture" },
      { id: "name", title: "Name" },
      { id: "price", title: "Price" },
      { id: "description", title: "Description" },
      { id: "category", title: "Category" },
    ],
  });
  csvWriter.writeRecords([]);
}

// Vérifiez et créez le dossier public s'il n'existe pas
const uploadPath = path.join(__dirname, "../../public");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuration de multer pour le téléchargement des images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const imageUrl = `${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

app.post("/add-product", (req, res) => {
  const { id, picture, name, price, description, category } = req.body;

  const csvWriter = createCsvWriter({
    path: productsFilePath,
    header: [
      { id: "id", title: "Id" },
      { id: "picture", title: "Picture" },
      { id: "name", title: "Name" },
      { id: "price", title: "Price" },
      { id: "description", title: "Description" },
      { id: "category", title: "Category" },
    ],
    append: true,
  });

  csvWriter
    .writeRecords([{ id, picture, name, price, description, category }])
    .then(() => res.status(200).send("Product added successfully"))
    .catch((error) => res.status(500).send(error.toString()));
});

app.post("/submit-order", (req, res) => {
  const { lastName, firstName, phoneNumber, email, place, cart } = req.body;

  const cartDetails = cart
    .map((item) => `${item.name} - ${item.price}€ x ${item.quantity}`)
    .join("\n");

  // Envoi de l'email au client
  const mailOptionsClient = {
    from: "calliste.ravix@gmail.com",
    to: email,
    subject: "Confirmation de commande",
    text: `Bonjour ${firstName},\n\nVotre commande a été passée avec succès.\n\nVoici un récapitulatif de votre commande:\n\nNom: ${lastName}\nPrénom: ${firstName}\nTéléphone: ${phoneNumber}\nEmail: ${email}\nLieu de livraison: ${place}\n\nDétails du panier:\n${cartDetails}\n\nMerci de votre confiance!`,
  };

  transporter.sendMail(mailOptionsClient, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
  });

  // Envoi de l'email à vous-même
  const mailOptionsOwner = {
    from: "calliste.ravix@gmail.com",
    to: "calliste.ravix@gmail.com",
    subject: "Nouvelle commande",
    text: `Nouvelle commande de ${firstName} ${lastName}.\n\nTéléphone: ${phoneNumber}\nEmail: ${email}\nLieu de livraison: ${place}\n\nDétails du panier:\n${cartDetails}`,
  };

  transporter.sendMail(mailOptionsOwner, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
  });

  // Ajout de la commande au fichier Excel
  const filePath = "./orders.xlsx";
  let workbook;
  if (existsSync(filePath)) {
    workbook = readFile(filePath);
  } else {
    workbook = utils.book_new();
  }
  const sheetName = "Orders";
  if (!workbook.Sheets[sheetName]) {
    workbook.Sheets[sheetName] = utils.json_to_sheet([]);
  }
  const worksheet = workbook.Sheets[sheetName];

  // Ajouter une ligne pour chaque produit dans le panier
  cart.forEach((item) => {
    const newRow = [
      lastName,
      firstName,
      phoneNumber,
      email,
      place,
      item.name,
      item.quantity,
    ];
    utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });
  });

  writeFile(workbook, filePath);

  res.status(200).send("Order submitted successfully");
});

// Endpoint pour récupérer les commandes
app.get("/orders", (req, res) => {
  const filePath = "./orders.xlsx";
  if (existsSync(filePath)) {
    const workbook = readFile(filePath);
    const worksheet = workbook.Sheets["Orders"];
    const rawOrders = utils.sheet_to_json(worksheet, { header: 1 });
    const orders = rawOrders.slice(1); // Ignore la première ligne
    res.status(200).json(orders);
  } else {
    res.status(404).send("No orders found");
  }
});

app.delete("/delete-product/:productId", (req, res) => {
  const productId = req.params.productId;

  console.log("Deleting product with ID:", productId);

  fs.readFile(productsFilePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading CSV file:", err);
      return res.status(500).send("Error deleting product");
    }

    const rows = data.split(/\r?\n/); // Split data into rows (including carriage returns)
    const header = rows[0]; // Extract the header row
    const filteredRows = rows.filter((row, index) => {
      // Skip the header row
      if (index === 0) return true;
      // Check if the row contains the product ID
      const columns = row.split(",");
      const rowProductId = columns[0]; // Assuming the ID column is the 1st column
      return rowProductId !== productId;
    });

    const updatedData = [header, ...filteredRows.slice(1)].join("\n");

    fs.writeFile(productsFilePath, updatedData, "utf-8", (err) => {
      if (err) {
        console.error("Error writing to CSV file:", err);
        return res.status(500).send("Error deleting product");
      }

      res.status(200).send("Product deleted successfully");
    });
  });
});

app.get("/products", (req, res) => {
  const products = [];
  fs.createReadStream(productsFilePath)
    .pipe(csv())
    .on("data", (data) => products.push(data))
    .on("end", () => {
      res.status(200).json(products);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
