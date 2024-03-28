import { Active, DragEndEvent, Over } from "@dnd-kit/core";
import { nanoid } from "nanoid";
import { ElementType, FormElementInstance, FormElements } from '@/components/FormElement';
import useDesigner from "../hooks/useDesigner";
import { DesignerContextType } from "../context/DesignerContext";


export function elementOverDesigner(event: DragEndEvent, selectedPage: number, context: DesignerContextType) {
    const { elements, setElements, addElement, removeElement, updateParent } = context;
    const { active, over } = event;
    console.log('test active 100', active);

    const isDroppingOverDesignerArea = over?.data?.current?.isDesignerDropArea;
    const isDesignerBtnElement = active?.data?.current?.isDesignerBtnElement;
    console.log('is designer area', isDroppingOverDesignerArea);
    if (isDroppingOverDesignerArea) {
        const type = active?.data?.current?.type;
        if (elements && selectedPage) {
            console.log('test selected page');
            console.log('selected page of area', active?.data?.current);
            const activeIndex = elements.findIndex((element: FormElementInstance) => element.id == active?.data?.current?.elementId);
            console.log("🚀 ~ elementOverDesigner ~ activeIndex:", activeIndex)
            if (activeIndex == -1) return;
            const cloneElements = [...elements];
            const clone = { ...cloneElements[activeIndex] };
            console.log('test selected page', selectedPage);
            clone.page = selectedPage;
            clone.parentId = null;
            cloneElements[activeIndex] = clone;
            setElements(cloneElements);
        }
    }
}