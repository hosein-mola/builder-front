import { GetFormById, GetFormWithSubmissions } from '@/actions/form';
import FormBuilder from '@/components/FormBuilder';
import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import React, { ReactNode } from 'react'
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { LuView } from 'react-icons/lu';
import { TbArrowBounce } from 'react-icons/tb';
import { StatsCard } from '../../page';
import { ElementType, FormElementInstance } from '@/components/FormElement';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { nanoid } from 'nanoid';

async function FormDetailPage({ params }: {
    params: { id: string }
}) {
    const form = await GetFormById(Number(params.id));

    if (!form) {
        throw new Error('form not found');
    }
    const { visit, submission } = form;

    let submissionRate = 0;
    if (visit > 0) {
        submissionRate = (submission / visit) * 100;
    }
    const bounceRate = 100 - submissionRate;

    return <>
        <div className="py-10 border-b border-muted">
            <div className="flex justify-between container">
                <h1 className="text-4xl font-bold truncate">{form.name}</h1>
                <VisitBtn shareUrl={form.sharedURL} />
            </div>
        </div>
        <div className="py-4 border-b border-muted">
            <div className="container flex gap-2 items-center justify-between">
                <FormLinkShare shareUrl={form.sharedURL} />
            </div>
        </div>
        <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
            <StatsCard
                title="Total visits"
                icon={<LuView className="text-blue-600" />}
                helperText="All time form visits"
                value={visit.toLocaleString() || ""}
                loading={false}
                className="shadow-md shadow-blue-600"
            />

            <StatsCard
                title="Total submissions"
                icon={<FaWpforms className="text-yellow-600" />}
                helperText="All time form submissions"
                value={submission.toLocaleString() || ""}
                loading={false}
                className="shadow-md shadow-yellow-600"
            />
            <StatsCard
                title="Submission rate"
                icon={<HiCursorClick className="text-green-600" />}
                helperText="Visits that result in form submission"
                value={submissionRate.toLocaleString() + "%" || ""}
                loading={false}
                className="shadow-md shadow-green-600"
            />
            <StatsCard
                title="Bounce rate"
                icon={<TbArrowBounce className="text-red-600" />}
                helperText="Visits that leaves without interacting"
                value={bounceRate.toLocaleString() + "%" || ""}
                loading={false}
                className="shadow-md shadow-red-600"
            />
        </div>

        <div className="container pt-10">
            <SubmissionsTable id={form.id} />
        </div>
    </>
}

export default FormDetailPage



type Row = { [key: string]: string } & {
    submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: number }) {
    const form = await GetFormWithSubmissions(id);

    if (!form) {
        throw new Error('form not found');
    }

    const formElements = JSON.parse(form.context) as FormElementInstance[];
    const columns: {
        id: string;
        label: string;
        require: boolean;
        type: ElementType;
    }[] = [];

    const rows: Row[] = [];
    form.FormSubmission.forEach((submission) => {
        const content = JSON.parse(submission.content);
        rows.push({
            ...content,
        });
    });

    formElements.forEach(element => {
        switch (element.type) {
            case "TextField":
                columns.push({
                    id: element.id,
                    label: element?.extraAttributes?.label,
                    require: element?.extraAttributes?.require,
                    type: element.type
                });
                break;
            default:
                break;
        }
    })

    return (
        <>
            <h1 className="text-2xl font-bold my-4">Submissions</h1>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead key={column.id} className="uppercase">
                                    {column.label}
                                </TableHead>
                            ))}
                            <TableHead className="text-muted-foreground text-right uppercase">Submitted at</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                {columns.map((column, colIdex) => {
                                    return <RowCell key={column.id} type={column.type} value={row[column.id]} />
                                })}
                                <TableCell className="text-muted-foreground text-right">
                                    asd
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

function RowCell({ type, value }: {
    type: ElementType,
    value: string
}) {
    const node: ReactNode = value;
    return <TableCell className='text-black'>{node}</TableCell>
}