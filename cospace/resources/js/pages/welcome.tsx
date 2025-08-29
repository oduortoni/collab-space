import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Collab Space">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col items-center bg-background text-foreground p-6 lg:justify-center lg:p-8">
                {/* Navigation */}
                <header className="mb-6 w-full max-w-[335px] text-sm lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-md border border-border px-5 py-1.5 text-sm leading-normal hover:border-ring"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-md border border-transparent px-5 py-1.5 text-sm leading-normal hover:border-border"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-md border border-border px-5 py-1.5 text-sm leading-normal hover:border-ring"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero */}
                <div className="flex w-full items-center justify-center lg:grow">
                    <main className="flex w-full max-w-[335px] flex-col items-center text-center lg:max-w-4xl lg:flex-row lg:text-left">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                                Collab Space
                            </h1>
                            <p className="mt-4 max-w-prose text-muted-foreground">
                                A collaborative platform where tinkerers share
                                projects, demos, and challenges — and get
                                focused, time-boxed feedback from the
                                community.
                            </p>

                            <div className="mt-6 flex gap-4 justify-center lg:justify-start">
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-primary px-5 py-2 text-primary-foreground hover:bg-primary/90"
                                >
                                    Join Now
                                </Link>
                                
                                {/* <Link
                                    href={route('projects.explore')}
                                    className="rounded-md border border-border px-5 py-2 hover:border-ring"
                                >
                                    Explore Projects
                                </Link> */}
                                
                            </div>
                        </div>
                    </main>
                </div>

                <div className="hidden h-14 lg:block"></div>
            </div>
        </>
    );
}
