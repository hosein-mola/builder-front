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
import { LuHeading1, LuHeading2 } from 'react-icons/lu';

const type: ElementType = "SubTitleField";

const extraAttributes = {
    title: "Subtitle field",
}

const propertiesSchema = z.object({
    title: z.string().min(2),
});

export const SubtitleFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: LuHeading2,
        label: 'Subtitle Field'
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance;
    const { title } = element.extraAttributes;
    return <div className={cn('flex flex-col gap-2 w-full justify-center', "")}>
        <Label className='text-muted-foreground'>
            <p className='text-lg'>{title}</p>
        </Label>
    </div>
}
function FormComponent({
    elementInstance,
}: {
    elementInstance: FormElementInstance,
    isInvalid?: boolean,
    submitValue?: SubmitFunction,
    defaultValue?: string
}) {
    const element = elementInstance as CustomInstance;
    const { title } = element.extraAttributes;
    return <p className='text-lg'>{title}</p>
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
            title: element.extraAttributes.title,
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
    return <Form {...form}>
        <form onSubmit={(e) => {
            e.preventDefault();
        }} onBlur={form.handleSubmit(applyChanges)} className='space-y-3'>
            <FormField control={form.control} name={'title'} render={({ field }) => {
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
                        TitleFieldFormElement
                    </FormDescription>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                </FormItem>;
            }} />
        </form>
    </Form>
}

