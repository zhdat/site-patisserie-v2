import { Cart } from "./cart";
import { HugeiconsChocolate } from "./logo";

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-6 text-center flex sticky top-0 z-50 shadow-md">
      <div className="flex-initial w-1/3 flex justify-start items-center ml-20">
        <HugeiconsChocolate />
      </div>
      <div className="flex-initial w-1/3 text-center flex justify-center items-center">
        <h1 className="text-6xl font-handwriting font-bold">GD Patisserie</h1>
      </div>
      <div className="flex-initial w-1/3 flex justify-end items-center mr-20">
        <Cart />
      </div>
    </header>
  );
}
