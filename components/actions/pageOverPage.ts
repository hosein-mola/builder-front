import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { DesignerContextType } from "../context/DesignerContext";
import { FormElementInstance } from "../FormElement";


export function pageOverPage(event: DragEndEvent, selectedPage: number, context: DesignerContextType) {
    const { elements, pages, setElements, setSelectedPage } = context;
    const { active, over } = event;
    const { setPages } = context;

    if (active?.id !== over?.id && over?.id !== undefined && active?.data?.current?.type == 'page') {
        setPages((items: number[]) => {
            const oldIndex = items.indexOf(Number(active.id));
            const newIndex = items.indexOf(Number(over.id));
            return arrayMove(items, oldIndex, newIndex);
        });
        const cloneElements = JSON.parse(JSON.stringify(elements));
        const clonePages = JSON.parse(JSON.stringify(pages)).sort((a: number, b: number) => a - b);;

        const updatedElements = cloneElements.map((element: any) => {
            const pageIndex = clonePages.indexOf(element.page);
            if (pageIndex !== -1) {
                return { ...element, page: pageIndex + 1 };
            } else {
                return element;
            }
        });
        console.log("🚀 ~ updatedElements ~ updatedElements:", updatedElements)
        // setElements(updatedElements);
    }
}