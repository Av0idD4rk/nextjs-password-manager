import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {QueryClientProvider} from "react-query";
import QueryProvider from "@/components/providers/query-provider";
import ModalProvider from "@/components/providers/modal-provider";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <QueryProvider>
            <ModalProvider/>{children}
        </QueryProvider>
        </body>
        </html>
    );
}
