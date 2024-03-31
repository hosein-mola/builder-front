import React from 'react'
import { TextFieldFormElement } from './fields/TextField';
import { IconType } from 'react-icons/lib';
import { TitleFieldFormElement } from './fields/TitleField';
import { SubtitleFieldFormElement } from './fields/SubTitleField';
import { PanelFieldElement } from './fields/PanelField';
import { UseDraggableArguments, useDraggable } from '@dnd-kit/core';

export type ElementType = "panel" | "text";

export type SubmitFunction = (key: string, value: string) => void;
export type FormElement = {
    construct: (id: string, index: number, parentId: string | null, page: number) => FormElementInstance;
    type: ElementType;
    designerBtnElement: {
        icon: IconType;
        label: string;
    },
    designerComponent: React.FC<{
        elementInstance: FormElementInstance,
    }>;
    formComponent: React.FC<{
        elementInstance: FormElementInstance,
        submitValue?: (key: string, value: string) => void,
        isInvalid?: boolean,
        defaultValue?: string
    }>;
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance
    }>;
    validate: (formElement: FormElementInstance, current: string) => boolean
}

export type FormElementInstance = {
    id: string;
    index: number,
    type: ElementType;
    parentId: string | null;
    page: number;
    extraAttributes: Record<string, any>;
}

type FormElementsType = {
    [key in ElementType]: FormElement
}
export const FormElements: FormElementsType = {
    text: TextFieldFormElement,
    panel: PanelFieldElement
};