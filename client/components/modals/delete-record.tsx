'use client';

import {useState} from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {useModal} from '@/hooks/use-modal-store';
import {Button} from '@/components/ui/button';
import {encryptVault} from "@/crypto";
import {useMutation} from "react-query";
import {saveVault} from "@/api";

function DeleteRecordModal() {
    const {isOpen, onClose, type, data} = useModal();

    const isModalOpen = isOpen && type === 'deleteRecord';
    const {index} = data;

    const [isLoading, setIsLoading] = useState(false);
    const mutation = useMutation(saveVault, {
        onSuccess: () => {
            handleClose()
        }
    })
    const onClick = async () => {
        let vault1: any = window && window.sessionStorage.getItem("vault")
        const vaultKey: any = window && window.sessionStorage.getItem("vk");
        const vault = JSON.parse(vault1).vault
        console.log(index)
        vault.splice(index, 1)
        const encryptedVault = encryptVault({
            vault: JSON.stringify({vault}),
            vaultKey,
        });
        mutation.mutate({
            encryptedVault,
        });
        window.sessionStorage.setItem("vault", JSON.stringify({vault}))

    };
    const handleClose = () => {
        location.reload();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Password</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this password? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                    </div>
                    <Button variant="destructive" onClick={onClick}>Delete</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteRecordModal;
