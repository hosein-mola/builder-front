import { Active, DragEndEvent, Over } from "@dnd-kit/core";
import { ulid } from "ulid";
import { ElementType, FormElementInstance, FormElements } from '@/components/FormElement';
import useDesigner from "../hooks/useDesigner";
import { ContextType } from "../context/DesignerContext";

export function sidebarOverElement(event: DragEndEvent, selectedPage: number, context: ContextType) {
    const { elements, addElement, removeElement } = context;
    const { active, over } = event;
    const isDroppingOverDesignerElementTopHalf = over?.data?.current?.isTopHalfDesigner ?? false;
    const isDroppingOverDesignerElementBottomHalf = over?.data?.current?.isButtomHalfDesigner ?? false;
    const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
    const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
    const droppingSidebarButtonOverDesingerElement = isDesignerBtnElement && isDroppingOverDesignerElement;
    if (elements == undefined) return;
    if (droppingSidebarButtonOverDesingerElement) {
        const type = active?.data?.current?.type;
        const newElement = FormElements[type as ElementType].construct(ulid(10), null, selectedPage);
        const overId = over?.data?.current?.elementId;
        const overElementIndex = elements?.findIndex(el => el.id == overId);
        if (overElementIndex === -1) {
            throw new Error('Element not found');
        }
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
            indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, newElement, elements[overElementIndex].parentId, selectedPage);
    }
}