'use client'

import Link from "next/link"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {z} from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation} from "react-query";
import {loginUser, registerUser} from "@/api";
import {decryptVault, generateVaultKey, hashPassword} from "@/crypto";
import {useRouter} from "next/navigation";

const LoginSchema = z.object({
    email: z
        .string()
        .min(1, {message: "This field has to be filled."})
        .email("This is not a valid email."),
    password: z
        .string()
        .min(1, {message: "This field has to be filled."}),
    hashedPassword: z
        .string(),
})

export function LoginForm() {
    const router = useRouter()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
            hashedPassword: "",
        },
    })

    const mutation = useMutation(loginUser, {
        onSuccess: ({salt, vault}) => {
            const hashedPassword = form.getValues("hashedPassword");

            const email = form.getValues("email");
            const vaultKey = generateVaultKey({
                hashedPassword,
                email,
                salt,
            });
            const decryptedVault = decryptVault({vault, vaultKey});


            window.sessionStorage.setItem("vk", vaultKey);
            window.sessionStorage.setItem("vault", JSON.stringify({"vault": decryptedVault}));

            router.push('/')
        },
    });

    function onSubmit(values: z.infer<typeof LoginSchema>) {
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
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                            Sign in to your account
                        </h2>
                    </div>
                    <Form {...form}>
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
                                )}/>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder-gray-400"
                                                placeholder="Your password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}/>
                            <div>
                                <Button
                                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-400 dark:hover:bg-indigo-500 dark:focus:ring-indigo-400"
                                    type="submit"
                                >
                                    Sign in
                                </Button>
                            </div>
                        </form>
                        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don&apos;t have an account?&nbsp;
                            <Link
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                href="/register"
                            >
                                Sign up
                            </Link>
                        </div>
                    </Form>
                </div>
            </div>
    )
}
