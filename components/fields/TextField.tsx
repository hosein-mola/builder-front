"use client"

import React, { useEffect, useState } from 'react'

import { ElementType, FormElement, FormElementInstance, SubmitFunction } from '../FormElement'
import { MdTextFields } from 'react-icons/md';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';
import { boolean, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../ui/form';
import { Switch } from '../ui/switch';
import useDesigner from '../hooks/useDesigner';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';

const type: ElementType = "text";

const extraAttributes = {
    id: '',
    label: "TextFiel",
    helper_text: "HelperText",
    required: false,
    placeholder: "Value here...",
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helper_text: z.string().max(200),
    required: z.boolean(),
    placeholder: z.string().max(50)
});

export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string, index: number, parentId: string | null, page: number) => {
        extraAttributes.id = id;
        return ({
            id,
            index,
            type,
            page,
            parentId,
            extraAttributes,
        })
    },
    designerBtnElement: {
        icon: MdTextFields,
        label: 'Text Field'
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formInstance: FormElementInstance, current: string): boolean => {
        const element = formInstance as CustomInstance;
        if (element.extraAttributes.require) {
            return current.length > 0;
        }
        return true;
    }
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function DesignerComponent({ elementInstance, }: { elementInstance: FormElementInstance }) {
    const { elements, selectedElement, setSelectedElement } = useDesigner();
    const element = elementInstance as CustomInstance;
    const { label, require, placeholder, helperText } = element.extraAttributes;

    return <>
        <div
            key={element.id + "id"}
            className={cn("flex hover:!cursor-pointer p-2 flex-col gap-2 min-w-full bg-background")}
        >
            <Label className='hover:!cursor-pointer '>
                {label}
                {require && '*'}
                <Input className='mt-2 hover:!cursor-pointer  ' readOnly placeholder={placeholder} />
                {helperText && <p className='text-muted-foreground hover:!cursor-pointer text-[0.8rem] mt-2'>{helperText}</p>}
            </Label>
        </div>
    </>
}
function FormComponent({
    elementInstance,
    submitValue,
    defaultValue,
    isInvalid }: {
        elementInstance: FormElementInstance,
        isInvalid?: boolean,
        submitValue?: SubmitFunction,
        defaultValue?: string
    }) {
    const element = elementInstance as CustomInstance;
    const { label, require, placeholder, helperText } = element.extraAttributes;
    const [value, setValue] = useState(defaultValue || "");
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid == true);
    }, [isInvalid])

    return <div className={cn('flex flex-col gap-2 w-full', "")}>
        <Label className={cn(error && "text-red-500")}>
            {label}
            {require && '*'}
            <Input
                onBlur={e => {
                    if (!submitValue) return null;
                    const valid = TextFieldFormElement.validate(element, e.target.value);
                    setError(!valid);
                    if (!valid) return;
                    submitValue(element.id, e.target.value);
                }}
                className={cn('mt-2', error && "text-red-500 border-red-500")}
                value={value}
                onChange={e => {
                    setValue(e.target.value);
                }}
                placeholder={placeholder}
            />
            {helperText && <p className={cn('text-muted-foreground text-[0.8rem] mt-2', error && "text-red-500")}>{helperText}</p>}
        </Label>
    </div>
}
function PropertiesComponent({
    elementInstance
}: { elementInstance: FormElementInstance }) {
    const { updateElement } = useDesigner();
    const element = elementInstance as CustomInstance;

    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label: element.extraAttributes.label,
            helper_text: element.extraAttributes.helper_text,
            required: element.extraAttributes.required,
            placeholder: element.extraAttributes.placeholder
        }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form])

    function applyChanges(values: propertiesFormSchemaType) {
        updateElement(element.id, {
            ...element,
            extraAttributes: { ...values }
        });
    }
    return <Form  {...form}>
        <form onSubmit={(e) => {
            e.preventDefault();
        }} onBlur={form.handleSubmit(applyChanges)} className='space-y-3'>
            <FormField control={form.control} name={'label'} render={({ field }) => {
                return <FormItem>
                    <FormLabel>label</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') e.currentTarget.blur();
                            }} />
                    </FormControl>
                    <FormDescription>
                        label of the field <br />will be displayed above the filed
                    </FormDescription>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                </FormItem>;
            }} />
            <FormField control={form.control} name={'placeholder'} render={({ field }) => {
                return <FormItem>
                    <FormLabel>placeHolder</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') e.currentTarget.blur();
                            }} />
                    </FormControl>
                    <FormDescription>
                        the placeHolder of the field
                    </FormDescription>
                    <FormMessage />
                </FormItem>;
            }} />
            <FormField control={form.control} name={'helper_text'} render={({ field }) => {
                return <FormItem>
                    <FormLabel>helper text</FormLabel>
                    <FormControl>
                        <Input
                            {...field}
                            onKeyDown={(e) => {
                                if (e.key == 'Enter') e.currentTarget.blur();
                            }} />
                    </FormControl>
                    <FormDescription>
                        helper text
                    </FormDescription>
                    <FormMessage />
                </FormItem>;
            }} />
            <FormField control={form.control} name={'required'} render={({ field }) => {
                return <FormItem className='flex items-center justify-between rounded-lg border p-3 shadow-sm'>
                    <div className='space-y-0.5'>
                        <FormLabel>Required</FormLabel>
                        <FormDescription>
                            Required
                        </FormDescription>
                    </div>
                    <FormControl dir='ltr'>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                </FormItem>;
            }} />
        </form>
    </Form>
}

