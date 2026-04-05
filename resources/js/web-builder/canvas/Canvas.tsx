import {
    DndContext,
    closestCenter,
  } from "@dnd-kit/core"
  
  import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
  } from "@dnd-kit/sortable"
  
  import SortableSection from "./SortableSection"
import { useBuilderStore } from "../store/useBuilderStore"
  
  export default function Canvas() {
    const sections = useBuilderStore((s) => s.sections)
    const reorder = useBuilderStore((s) => s.reorderSections)
  
    function handleDragEnd(event: any) {
      const { active, over } = event
  
      if (active.id !== over.id) {
        const oldIndex = sections.findIndex((s) => s.id === active.id)
        const newIndex = sections.findIndex((s) => s.id === over.id)
  
        reorder(arrayMove(sections, oldIndex, newIndex))
      }
    }
  
    return (
      <div className="flex-1 overflow-auto bg-white">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableSection key={section.id} section={section} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    )
  }