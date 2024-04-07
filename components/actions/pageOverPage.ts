import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DesignerContextType } from "../context/DesignerContext";
import { FormElementInstance } from "../FormElement";


export function pageOverPage(event: DragEndEvent, selectedPage: number, context: DesignerContextType) {
    const { elements, pages, setElements, setSelectedPage } = context;
    const { active, over } = event;
    const { setPages } = context;

    if (active?.id !== over?.id && over?.id !== undefined && active?.data?.current?.type == 'page') {
        const oldIndex = pages.indexOf(Number(active.id));
        const newIndex = pages.indexOf(Number(over.id));
        setPages((items: number[]) => {
            return arrayMove(items, oldIndex, newIndex);
        });
        const clone = JSON.parse(JSON.stringify(elements));
        const data = clone.map((item: FormElementInstance) => {
            if (item.page == oldIndex + 1) {
                return { ...item, page: newIndex + 1 };
            } else if (item.page == newIndex + 1) {
                return { ...item, page: oldIndex + 1 };
            } else {
                return item;
            }
        });
        setElements(data);
        setSelectedPage(newIndex + 1);
    }
}