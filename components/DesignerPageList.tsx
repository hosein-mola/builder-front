import React, { MouseEvent, useState } from 'react'
import SidebarBtnElement from './SidebarBtnElement'
import { FormElementInstance, FormElements } from './FormElement'
import useDesigner from './hooks/useDesigner'
import FormElementSidebar from './FormElementSidebar';
import PropertiesFormSidebar from './PropertiesFormSidebar';
import { Separator } from './ui/separator';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    Active,
    Over,
    DragEndEvent,
    DragStartEvent,
    useDroppable,
    useDndMonitor,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable';
import { DragHandleDots1Icon, PlusCircledIcon } from '@radix-ui/react-icons';
import { CSS } from "@dnd-kit/utilities";
import { cn } from '@/lib/utils';

function DesignerPageList() {
    const { pages, active, selectedPage, setSelectedPage, draggedItem } = useDesigner();

    return (
        <aside className='w-[400px] max-w-[400px]  flex flex-col items-center gap-2 h-full flex-grow  border-l border-muted px-2 bg-background overflowx-y-auto '>
            <div dir='rtl' className='flex flex-col  h-full p-2 w-full flex-grow '>
                <div className='text-sm h-8 items-center flex text-foreground/70  '>Pages</div>
                <Separator className='mt-2' />
                <SortableContext
                    items={pages}
                    strategy={verticalListSortingStrategy}
                >
                    <div
                        className='w-full h-full mt-4 flex flex-grow flex-col gap-2 overflow-x-hidden pointer'>
                        {pages.sort((a: number, b: number) => a - b).map((id, index) => <SortableItem key={index} index={index} id={id} active={active} draggedItem={draggedItem} selectedPage={selectedPage} setSelectedPage={setSelectedPage} />)}
                    </div>
                </SortableContext>
                {/* </DndContext> */}
            </div >
        </aside>
    )
}

export default DesignerPageList



function SortableItem(props: any) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.id,
        data: {
            type: "page"
        }
    })

    const droppble = useDroppable({
        id: "page-" + props.id,
        data: {
            id: props.id,
            isPage: true
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const switchPage = (event: MouseEvent) => {
        event.stopPropagation();
        props.setSelectedPage(props.id)
    }

    const type = props?.draggedItem?.data?.current?.type;
    const isPage = type == "page";

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={{ ...style, zIndex: props?.active?.id == props.id ? 9999999 : 9 }} className='w-full flex flex-row gap-2'>
            <div className={cn('flex relative flex-row gap-2 bg-background p-1 min-w-full h-auto ',
                props.draggedItem?.id == props.id && "opacity-0"
            )} >
                <div
                    onClick={switchPage}
                    className={cn('flex flex-row gap-2 bg-background p-1 w-full')}
                >
                    {!isPage && type !== undefined && <div ref={droppble.setNodeRef} className={cn('w-full bg-red- absolute flex items-center     h-32 rounded-xl',
                    )}></div>}
                    <div className={cn('w-11/12 flex items-center px-2 border cursor-pointer active:ring-2 ring-foreground h-32 rounded-xl',
                        props.selectedPage == props.id && "ring-2 ring-foreground"
                    )}></div>
                    <span className='w-1/12 text-sm text-center text-muted-foreground/50 '>{props.index + 1}</span>
                </div>
            </div>
        </div>
    )
}
