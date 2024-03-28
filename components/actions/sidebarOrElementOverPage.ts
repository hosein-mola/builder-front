import { DragOverEvent } from "@dnd-kit/core";
import { DesignerContextType } from "../context/DesignerContext";

export function sidebarOrElementOverPage(event: DragOverEvent, selectedPage: number, context: DesignerContextType) {
    const { setSelectedPage, setActive } = context;
    const { active, over } = event;
    const isPage = over?.data?.current?.isPage;
    const pageId = over?.data?.current?.id;
    if (isPage) {
        setSelectedPage(pageId);
    }
}