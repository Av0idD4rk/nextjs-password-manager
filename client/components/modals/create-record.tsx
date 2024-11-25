'use client';

import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';

import axios from 'axios';
import {useRouter} from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {useModal} from '@/hooks/use-modal-store';

import {encryptVault} from "@/crypto";

import {useMutation} from "react-query";
import {saveVault} from "@/api";


const formSchema = z.object({
    website: z
        .string()
        .url()
        .min(1, {message: "This field has to be filled."}),
    username: z
        .string()
        .min(1, {message: "This field has to be filled."}),
    password: z
        .string()
        .min(1, {message: "This field has to be filled."}),
});

function CreateRecordModal() {
    const {isOpen, onClose, type} = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === 'createRecord';

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            website: "",
            username: "",
            password: ""
        },
    });


    const isLoading = form.formState.isSubmitting;
    const mutation = useMutation(saveVault, {
        onSuccess: () => {
            handleClose()
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const website = form.getValues("website")
        const username = form.getValues("username")
        const password = form.getValues("password");
        const vaultKey: any = window && window.sessionStorage.getItem("vk");
        let vault1 = window && window.sessionStorage.getItem("vault")
        if (vault1 != "null" && vault1) {
            console.log(vault1)
            const vault =  JSON.parse(vault1).vault
            vault.push({website: website, username: username, password: password})
            const encryptedVault = encryptVault({
                vault: JSON.stringify({vault}),
                vaultKey,
            });
            mutation.mutate({
                encryptedVault,
            });
            window.sessionStorage.setItem("vault", JSON.stringify({vault}))
        } else {
            const vault = []
            vault.push({website: website, username: username, password: password})
            const encryptedVault = encryptVault({
                vault: JSON.stringify({vault}),
                vaultKey,
            });
            mutation.mutate({
                encryptedVault,
            });
            window.sessionStorage.setItem("vault", JSON.stringify({vault}))
        }
    }

    const handleClose = () => {
        form.reset();
        location.reload();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new record</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="website"
                            render={({field}) => (
                                <FormItem
                                    className="grid gap-2"
                                >
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400"
                                            placeholder="Enter your website" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        <FormField
                            control={form.control}
                            name="username"

                            render={({field}) => (
                                <FormItem
                                    className="grid gap-2"
                                >
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400"
                                            placeholder="Enter your username" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem
                                    className="grid gap-2"
                                >
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400"
                                            placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                        <DialogFooter>
                            <Button type="submit">Save record</Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}

export default CreateRecordModal;
