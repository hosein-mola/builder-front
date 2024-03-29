import { Active, DragEndEvent, Over } from "@dnd-kit/core";
import { ulid } from "ulid";
import { ElementType, FormElementInstance, FormElements } from '@/components/FormElement';
import useDesigner from "../hooks/useDesigner";
import { ContextType } from "../context/DesignerContext";

export function elementOverElement(event: DragEndEvent, selectedPage: number, context: ContextType) {
    const { elements, addElement, removeElement } = context;
    const { active, over } = event;
    console.log("🚀 ~ elementOverElement ~ active:", active);
    const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
    const isDraggingDesignerElement = active?.data?.current?.isDesignerElement;
    const isDroppingOverDesignerElementTopHalf = over?.data?.current?.isTopHalfDesigner ?? false;
    const isDroppingOverDesignerElementBottomHalf = over?.data?.current?.isButtomHalfDesigner ?? false;
    const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
    const droppingSidebarButtonOverDesingerElement = isDesignerBtnElement && isDroppingOverDesignerElement;
    const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;
    if (draggingDesignerElementOverAnotherDesignerElement) {
        console.log("🚀 ~ elementOverElement ~ elementOverElement:")
        const activeId = active.data.current?.elementId;
        const overId = over?.data.current?.elementId;
        const activeElementIndex = elements.findIndex(el => el.id == activeId);
        const overElementIndex = elements.findIndex(el => el.id == overId);
        if (activeElementIndex == -1 || overElementIndex == -1) {
            throw new Error('element not found');
        }
        const isReversed = overElementIndex <= activeElementIndex;
        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);
        let indexForNewElement = overElementIndex - 1 <= 0 ? 0 : overElementIndex - 1;
        if (isReversed) {
            indexForNewElement = overElementIndex;
        }
        if (isDroppingOverDesignerElementBottomHalf) {
            if (isReversed) {
                indexForNewElement = overElementIndex + 1;
            } else {
                indexForNewElement = overElementIndex;
            }
        }
        addElement(indexForNewElement, activeElement, elements[overElementIndex].parentId, selectedPage);
    } else {
        console.log('else');
    }
}