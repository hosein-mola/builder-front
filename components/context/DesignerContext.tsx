"use client"
import { Active } from "@dnd-kit/core";
import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";
import { ulid } from "ulid";
import { FormElementInstance, FormElements } from "../FormElement";
import { reIndexed } from "../actions/elementOverElement";

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
    duplicatePage: (page: number, index: number) => void;
    newPage: (page: number, index: number) => void;
    deletePage: (page: number, index: number) => void;
}

export type ContextType = DesignerContextType;
export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
    children
}: {
    children: ReactNode
}) {
    const [elements, setElements] = useState<FormElementInstance[]>([]);
    const [pages, setPages] = useState(Array.from(Array(20).keys()).map((item: number) => item + 1));
    const [active, setActive] = useState<Active | null>(null);
    const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null);
    const [selectedElementParents, setSelectedElementParents] = useState<FormElementInstance[]>([]);
    const [selectedPage, setSelectedPage] = useState<number>(1);
    const [draggedItem, setDraggedItem] = useState<Active | null>(null);

    useEffect(() => {
        console.log("🚀 ~ elements:", elements)
    }, [elements])

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
            element.parentId = parentId;
            element.page = page;
            newElement.splice(index, 0, element);
            const indexded = reIndexed(newElement);
            return indexded;
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

    function duplicateItems(originalArray: FormElementInstance[], targetPage: number, newPage: number): FormElementInstance[] {
        const duplicateMap: Record<string, string> = {};
        let duplicatedArray: FormElementInstance[] = [];
        [...originalArray].filter((item: FormElementInstance) => item.page == targetPage).map((item: FormElementInstance) => {
            const duplicatedItem = FormElements[item.type].construct(ulid(10), item.index, item.parentId, newPage, item.extraAttributes);
            duplicatedArray.push(duplicatedItem);
            duplicateMap[item.id] = duplicatedItem.id;
        });
        duplicatedArray.forEach((item: any) => {
            item.parentId = duplicateMap[item.parentId];
        });
        return duplicatedArray;
    }

    function duplicatePage(page: number, index: number) {
        const cloneELements = [...elements];
        const clonePages = [...pages];
        const newPage = clonePages.length + 1;
        const getAllItemsInPage: FormElementInstance[] = duplicateItems(cloneELements, page, newPage)
        clonePages.splice(index + 1, 0, newPage);
        if (!getAllItemsInPage) { return }
        setPages([...clonePages]);
        setElements((prev: FormElementInstance[]) => [...prev, ...getAllItemsInPage]);
    }

    function newPage(page: number, index: number) {
        const clonePages: number[] = [...pages];
        const newPage = pages.length + 1;
        clonePages.splice(index + 1, 0, newPage);
        setPages([...clonePages]);
    }

    function deletePage(page: number, index: number) {
        const clonePages = [...pages];
        clonePages.splice(index, 1);
        console.log("🚀 ~ deletePage ~ clonePages:", clonePages)
        setElements((prev: FormElementInstance[]) => prev.filter((item: FormElementInstance) => item.page != page));
        setPages([...clonePages]);
        setSelectedPage(index + 1);
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
        duplicatePage,
        newPage,
        deletePage,
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

