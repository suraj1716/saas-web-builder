import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { componentRegistry } from "../components/registry"

export default function SortableSection({ section }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Component = componentRegistry[section.type]

  if (!Component) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border hover:border-blue-500"
    >
      <Component id={section.id} data={section.data} />
    </div>
  )
}