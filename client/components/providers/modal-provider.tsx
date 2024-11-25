'use client';

import { useEffect, useState } from 'react';
import CreateRecordModal from '@/components/modals/create-record';
import DeleteRecordModal from "@/components/modals/delete-record";

function ModalProvider(){
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }
    return (
        <>
            <CreateRecordModal />
            <DeleteRecordModal />
        </>
    );
}
export default ModalProvider;
