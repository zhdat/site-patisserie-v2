export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="py-6 container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>© 2024 - Tous droits réservés</p>
        </div>
        <div className="flex space-x-8">
          <p className="hover:underline cursor-pointer mx-2">
            Mentions légales
          </p>
          <p className="hover:underline cursor-pointer mx-2">À propos</p>
          <p className="hover:underline cursor-pointer mx-2">Contactez-nous</p>
        </div>
      </div>
    </footer>
  );
}
