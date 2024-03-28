import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DesignerContextType } from "../context/DesignerContext";


export function pageOverPage(event: DragEndEvent, selectedPage: number, context: DesignerContextType) {
    const { active, over } = event;
    const { setPages } = context;
    if (active?.id !== over?.id && over?.id !== undefined) {
        setPages((items: number[]) => {
            const oldIndex = items.indexOf(Number(active.id));
            const newIndex = items.indexOf(Number(over.id));
            return arrayMove(items, oldIndex, newIndex);
        });
    }
}