import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">Template Marketplace</Link>
      <div className="space-x-4">
        <Link to="/">Marketplace</Link>
      </div>
    </nav>
  );
}