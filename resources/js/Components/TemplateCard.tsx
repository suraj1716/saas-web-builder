import { Template } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
  template: Template;
}

export default function TemplateCard({ template }: Props) {
  const navigate = useNavigate();
  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition">
      <img src={template.previewImage} className="w-full h-48 object-cover rounded" />
      <h3 className="font-bold mt-2">{template.name}</h3>
      <p className="text-gray-500">${template.price}</p>
      <p className="text-sm mt-1">{template.description}</p>
      <button
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => navigate(`/template/${template.id}`)}
      >
        View / Buy
      </button>
    </div>
  );
}