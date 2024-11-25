"use client"

import {Button} from "@/components/ui/button"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {JSX, SVGProps, useEffect, useState} from "react"
import MainSidebar from "@/components/main/sidebar";
import copy from 'clipboard-copy';
import {useModal} from "@/hooks/use-modal-store";
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import {Progress} from "@/components/ui/progress";

const CopyToClipboardButton = ({text}: { text: string }) => {
    const [isCopied, setIsCopied] = useState(false);
    const handleCopyClick = async () => {
        try {
            await copy(text);
            setIsCopied(true);
        } catch (error) {
            console.error('Failed to copy text to clipboard', error);
        }
    };

    return (
        <div>
            <Button size="icon" variant="ghost" onClick={handleCopyClick}>
                {isCopied ? <CheckIcon className="h-4 w-4"/> : <CopyIcon className="h-4 w-4"/>}
                <span className="sr-only">Copy password</span>
            </Button>
        </div>
    );
};

function PasswordRow({website, username, password, index}: {
    website: string,
    username: string,
    password: string,
    index: number
}) {
    const [showPassword, setShowPassword] = useState(false)
    const {onOpen} = useModal();
    console.log(zxcvbn(password).score)
    return (
        <TableRow>
            <TableCell><a href={website}>{website}</a></TableCell>

            <TableCell>{username}</TableCell>
            <TableCell><input
                style={{"background": "transparent", "border": "none", "color": "#000"}}
                type={showPassword ? "text" : "password"}
                value={password}/>
            </TableCell>
            <TableCell>
                <Progress value={zxcvbn(password).score*25} indicatorColor= "bg-blue-300"></Progress>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <CopyToClipboardButton text={password}/>
                    <Button
                        onClick={() => setShowPassword(!showPassword)}
                        size="icon" variant="ghost">
                        {showPassword ? <EyeOffIcon className="h-4 w-4"/> : <EyeIcon className="h-4 w-4"/>}
                        <span className="sr-only">View password</span>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onOpen('deleteRecord', {index: index})}>
                        <Trash2Icon className="h-4 w-4"/>
                        <span className="sr-only">Delete</span>
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export interface VaultItem {
    website: string;
    username: string;
    password: string;
}

export function MainPage() {

    const [isVault, setIsVault] = useState(false)
    const [vault, setVault] = useState([])
    const {onOpen} = useModal();

    useEffect(() => {
        let vault = window && (window.sessionStorage.getItem("vault"));
        if (vault != "null" && vault) {
            if (JSON.parse(vault).vault.length) {
                setVault(JSON.parse(vault).vault)
                setIsVault(true)
            }
        }
    }, [setVault, setIsVault]);

    return (
        <div className="flex h-screen w-full">
            <MainSidebar/>
            <div className="flex w-full flex-col">
                <div
                    className="border-b border-gray-200 bg-gray-100/40 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/40 lg:px-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg font-semibold">Password Vault</h1>
                        <Button size="sm" variant="outline" onClick={() => onOpen('createRecord')}>
                            <PlusIcon className="h-4 w-4 mr-2"/>
                            Add Password
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto p-4 md:p-6">
                    <div className="border rounded-lg border-gray-200 w-full dark:border-gray-800">
                        <div className="relative w-full overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Website</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>
                                            Password
                                        </TableHead>
                                        <TableHead>Security Score</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isVault && vault.map((value: VaultItem, index) => (
                                        <PasswordRow index={index} password={value.password} website={value.website}
                                                     username={value.username} key={index}></PasswordRow>

                                    ))}
                                </TableBody>
                            </Table>
                            {!isVault &&
                                <div
                                    className="flex items-center justify-center">
                                    <div
                                        className="bg-white p-6 max-w-md w-full">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            There are no passwords, you can&nbsp;
                                            <button onClick={() => onOpen('createRecord')}
                                                    className="text-blue-500 hover:text-blue-600 font-medium">add
                                                new
                                            </button>
                                        </p>
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CopyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
    )
}

function CheckIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-check"
        >
            <path d="M20 6 9 17l-5-5"/>
        </svg>
    )
}


function EyeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    )
}

function EyeOffIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
            <line x1="2" x2="22" y1="2" y2="22"/>
        </svg>
    )
}

function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
        </svg>
    )
}


function Trash2Icon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            <line x1="10" x2="10" y1="11" y2="17"/>
            <line x1="14" x2="14" y1="11" y2="17"/>
        </svg>
    )
}

