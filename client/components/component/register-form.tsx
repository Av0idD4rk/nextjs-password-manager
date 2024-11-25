'use client'

import Link from "next/link";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useMutation} from "react-query";
import {registerUser} from "@/api";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {generateVaultKey, hashPassword} from "@/crypto";
import {useRouter} from "next/navigation"

const RegisterSchema = z.object({
    email: z
        .string()
        .min(1, {message: "This field has to be filled."})
        .email("This is not a valid email."),
    password: z
        .string()
        .min(1, {message: "This field has to be filled."}),
    confirm: z
        .string()
        .min(1, {message: "This field has to be filled."}),
    hashedPassword: z
        .string(),
})
    .refine((data) => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ["confirm"]
    });

export function RegisterForm() {
    const router = useRouter()
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            confirm: "",
            hashedPassword: ""
        },
    })

    const mutation = useMutation(registerUser, {
        onSuccess: ({salt, vault}) => {
            const email = form.getValues("email")
            const hashedPassword = form.getValues("hashedPassword")

            const vaultKey = generateVaultKey({
                hashedPassword,
                email,
                salt
            });

            window.sessionStorage.setItem("vk", vaultKey);
            window.sessionStorage.setItem("vault", "");
            router.push('/')
        },
    });

    function onSubmit(values: z.infer<typeof RegisterSchema>) {
        const password = form.getValues("password");
        const email = form.getValues("email");

        const hashedPassword = hashPassword(password);

        form.setValue('hashedPassword', hashedPassword)
        mutation.mutate({
            email,
            hashedPassword,
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-12 dark:bg-gray-950">
            <div className="mx-auto w-full max-w-md space-y-8">
                <Form {...form}>
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                            Create a new account
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Or&nbsp;
                            <Link
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                href="/login"
                            >
                                sign in to your existing account
                            </Link>
                        </p>
                    </div>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400"
                                            placeholder="Your email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400"
                                            type="password"
                                            placeholder="Your password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm
                                        Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400"
                                            type="password"
                                            placeholder="Type your password again" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <div>
                            <Button
                                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-400 dark:hover:bg-indigo-500 dark:focus:ring-indigo-400"
                                type="submit"
                            >
                                Create account
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}