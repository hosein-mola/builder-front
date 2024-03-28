import { Active, DragEndEvent, Over } from "@dnd-kit/core";
import { nanoid } from "nanoid";
import { ElementType, FormElementInstance, FormElements } from '@/components/FormElement';
import useDesigner from "../hooks/useDesigner";
import { ContextType } from "../context/DesignerContext";


export function sidebarOverDesigner(event: DragEndEvent, selectedPage: number | undefined, context: ContextType) {
    const { elements, addElement, removeElement } = context;
    const { active, over } = event;
    const isDroppingOverDesignerArea = over?.data?.current?.isDesignerDropArea;
    const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
    const droppingSidebarButtonOverDesignerArea = isDesignerBtnElement && isDroppingOverDesignerArea;
    if (droppingSidebarButtonOverDesignerArea) {
        const type = active?.data?.current?.type;
        if (elements && selectedPage) {
            const newElement = FormElements[type as ElementType].construct(nanoid(10), null, selectedPage);
            addElement(elements.length, newElement, null, selectedPage);
        }
    }
}