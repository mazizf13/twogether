import React from "react";
import { Link, Head, useForm } from "@inertiajs/react";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { FormField } from "@/components/molecules/FormField";
import { PasswordInput } from "@/components/molecules/PasswordInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Log in to continue planning your wedding."
        >
            {status && (
                <div className="mb-4 font-medium text-sm text-green-600 bg-green-50 p-3 rounded-md">
                    {status}
                </div>
            )}

            {Object.keys(errors).length > 0 && (
                <div className="mb-6 p-4 rounded-md bg-red-50 text-red-600 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div className="text-sm font-medium">
                        {errors.email ||
                            errors.password ||
                            "These credentials do not match our records."}
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <FormField label="Email Address" error={errors.email}>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="you@example.com"
                        className={
                            errors.email
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                        }
                    />
                </FormField>

                <div className="space-y-2">
                    <FormField label="Password" error={errors.password}>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="********"
                            className={
                                errors.password
                                    ? "border-red-500 focus-visible:ring-red-500"
                                    : ""
                            }
                        />
                    </FormField>

                    {canResetPassword && (
                        <div className="flex justify-end">
                            <Link
                                href="/forgot-password"
                                className="text-sm font-medium text-pink-600 hover:text-pink-500"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={data.remember}
                        onCheckedChange={(checked) =>
                            setData("remember", checked as boolean)
                        }
                    />
                    <Label
                        htmlFor="remember"
                        className="text-sm font-normal text-neutral-600 dark:text-neutral-300"
                    >
                        Remember me
                    </Label>
                </div>

                <Button
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    disabled={processing}
                >
                    Sign In
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
                Don't have an account?{" "}
                <Link
                    href="/register"
                    className="font-medium text-pink-600 hover:text-pink-500 underline underline-offset-4"
                >
                    Create one
                </Link>
            </div>
        </AuthLayout>
    );
}
