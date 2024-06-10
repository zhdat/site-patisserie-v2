import { Products } from "@/components/products";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="p-4">
        <Products />
      </main>
      <Footer />
    </div>
  );
}
