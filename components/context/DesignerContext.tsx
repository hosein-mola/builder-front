"use client"
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { FormElementInstance, FormElements } from "../FormElement";
import { Active } from "@dnd-kit/core";

export type DesignerContextType = {
    context?: DesignerContextType,
    elements: FormElementInstance[];
    selectedElement?: FormElementInstance | null,
    selectedElementParents: FormElementInstance[],
    draggedItem?: Active | null;
    selectedPage: number;
    pages: number[],
    active: Active | null,
    setActive: Dispatch<SetStateAction<Active | null>>,
    addElement: (index: number, element: FormElementInstance, parentId: string | null, page: number) => void
    updateParent: (element: FormElementInstance, parentId: string | null) => void
    updateIndex: (element: FormElementInstance, index: number) => void
    removeElement: (id: string) => void,
    setElements: Dispatch<SetStateAction<FormElementInstance[]>>,
    setSelectedElement: Dispatch<SetStateAction<FormElementInstance | null>>,
    setSelectedPage: Dispatch<SetStateAction<number>>,
    updateElement: (id: string, element: FormElementInstance) => void,
    swapElement: (fromIndex: number, toIndex: number) => void,
    updateSelectedParents: (element: FormElementInstance, level: number) => void,
    setDraggedItem: Dispatch<SetStateAction<Active | null>>,
    setPages: Dispatch<SetStateAction<number[]>>,
}

export type ContextType = DesignerContextType;
export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
    children
}: {
    children: ReactNode
}) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const [pages, setPages] = useState(Array.from(Array(100).keys()));
    const [active, setActive] = useState<Active | null>(null);
    const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null);
    const [selectedElementParents, setSelectedElementParents] = useState<FormElementInstance[]>([]);
    const [selectedPage, setSelectedPage] = useState<number>(1);
    const [draggedItem, setDraggedItem] = useState<Active | null>(null);


    const swapElement = (fromIndex: number, toIndex: number) => {
        setElements(prev => {
            let copy = [...prev];
            copy[fromIndex].index = toIndex;
            copy[toIndex].index = fromIndex;
            [copy[fromIndex], copy[toIndex]] = [copy[toIndex], copy[fromIndex]];
            return copy;
        })
    }
    const updateParent = (element: FormElementInstance, parentId: string | null) => {
        setElements(prev => {
            const newElement = [...prev];
            element.parentId = parentId;
            const elementIndex = newElement.findIndex(el => el.id == element.id);
            newElement[elementIndex] = element;
            return newElement;
        })
    }
    const updateIndex = (element: FormElementInstance, index: number) => {
        setElements(prev => {
            const newElement = [...prev];
            element.index = index;
            const elementIndex = newElement.findIndex(el => el.id == element.id);
            newElement[elementIndex] = element;
            return newElement;
        })
    }
    const addElement = (index: number, element: FormElementInstance, parentId: string | null, page: number) => {
        setElements(prev => {
            const newElement = [...prev];
            element.index = index;
            element.parentId = parentId;
            element.page = page;
            newElement.splice(index, 0, element);
            return newElement;
        })
    }
    const updateSelectedParents = (element: FormElementInstance, level: number) => {
        const newBroadCumb = [element, ...findParentsRecursiveWithLevel(element, elements, 0)];
        setSelectedElementParents(newBroadCumb);
    }
    const removeElement = (id: string) => {
        setElements(prev => prev.filter(element => element.id != id))
    }
    const updateElement = (id: string, element: FormElementInstance) => {
        setElements((prev) => {
            const newElement = [...prev];
            const index = newElement.findIndex(el => el.id == id);
            newElement[index] = element;
            return newElement;
        })
    }
    function findParentsRecursiveWithLevel(node: FormElementInstance, array: FormElementInstance[], level: number): FormElementInstance[] {
        const parent = array.find(obj => obj.id === node.parentId);
        const parents = [];

        // If parent is found, recursively find its parent
        if (parent) {
            // If parent has a non-null parentId, continue recursion
            if (parent.parentId !== null) {
                const parentWithLevel = { ...parent, level };
                parents.push(parentWithLevel);
                parents.push(...findParentsRecursiveWithLevel(parent, array, level + 1));
            } else {
                // If parent has a null parentId, this is the top level
                const parentWithLevel = { ...parent, level };
                parents.push(parentWithLevel);
            }
        }

        return parents;
    }

    const context = {
        elements,
        pages,
        active,
        selectedElement,
        selectedElementParents,
        selectedPage,
        draggedItem,
        setPages,
        setActive,
        addElement,
        updateSelectedParents,
        updateParent,
        updateIndex,
        swapElement,
        removeElement,
        setElements,
        setSelectedElement,
        updateElement,
        setSelectedPage,
        setDraggedItem
    }
    return <DesignerContext.Provider value={{ ...context, context: context }}>{children}</DesignerContext.Provider>
}

