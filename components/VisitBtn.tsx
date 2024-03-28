"use client"
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';

function VisitBtn({ shareUrl }: { shareUrl: string }) {
    const [mounted, setMounted] = useState(false);
    const shareLink = `${window.location.origin}/submit/${shareUrl}`;

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) return null;
    return <Button className='w-[200px]' onClick={() => {
        window.open(shareLink, '_blank');
    }}>
        Visit Link
    </Button>
}

export default VisitBtn