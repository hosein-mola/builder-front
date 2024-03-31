import { Active, DragEndEvent, Over } from "@dnd-kit/core";
import { ulid } from "ulid";
import { ElementType, FormElementInstance, FormElements } from '@/components/FormElement';
import useDesigner from "../hooks/useDesigner";
import { ContextType } from "../context/DesignerContext";
export function elementOverPanel(event: DragEndEvent, selectedPage: number, context: ContextType) {
    const { elements, addElement, updateParent, removeElement } = context;
    const { active, over } = event;
    const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
    const overType = over?.data?.current?.type;
    const overId = over?.data?.current?.id;
    const isDroppingOverDesignerElementTopHalf = over?.data?.current?.isTopHalfDesigner ?? false;
    const isDroppingOverDesignerElementBottomHalf = over?.data?.current?.isButtomHalfDesigner ?? false;
    const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
    if (overType == "panel") {
        if (isDesignerBtnElement && !isDroppingOverDesignerElement) {
            const type = active?.data?.current?.type;
            const newElement = FormElements[type as ElementType].construct(ulid(10), overId, null, selectedPage);
            addElement(elements.length, newElement, over?.data?.current?.extraAttributes.id, selectedPage);
        }
        if (!isDroppingOverDesignerElement) {
            const elementIndex = elements.findIndex(el => el.id == active?.data?.current?.id);
            console.log('elementIndex', over?.data?.current?.extraAttributes?.id);
            if (elementIndex !== -1) {
                updateParent(elements[elementIndex], over?.data?.current?.extraAttributes?.id);
            }
        }
    }
}