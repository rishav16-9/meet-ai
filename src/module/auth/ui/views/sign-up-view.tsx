"use client";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { OctagonAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export const SignUpView = () => {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>("");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: () => {
          setPending(false);
          router.push("/");
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
        },
      }
    );
  };
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid md:grid-cols-2 p-0">
          <Form {...form}>
            <form
              className="p-6 lg:pl-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex flex-col gap-y-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Let&apos;s get started</h1>
                  <p className="text-muted-foreground text-balance">
                    Create your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Doe"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-3">
                    <FormField
                      name="password"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <Input
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-3">
                    <FormField
                      name="confirmPassword"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm password</FormLabel>
                          <Input
                            placeholder="********"
                            type="password"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {!!error && (
                    <Alert className="bg-destructive/10 border-none">
                      <OctagonAlertIcon className="h-4 w-4 !text-destructive" />
                      <AlertTitle>{error}</AlertTitle>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={pending}>
                    Sign up
                  </Button>
                  <div className="text-center text-sm relative after:border-border after:inset-0 after:absolute after:border-t after:z-0 after:flex after:items-center after:top-1/2">
                    <span className="text-muted-foreground bg-card z-10 relative px-2">
                      Or continue with
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      type="button"
                      disabled={pending}
                      className="w-full"
                    >
                      Google
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      disabled={pending}
                      className="w-full"
                    >
                      Github
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </Form>
          <div className="bg-radial from-green-700 to-green-900 hidden md:flex flex-col gap-y-4 justify-center items-center">
            <img src="/logo.svg" alt="logo" className="h-[92px] w-[92px]" />
            <p className="text-3xl font-semibold text-white">Meet.ai</p>
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-sm *:[a]:hover:text-primary text-balance *:[a]:hover:underline *:[a]:hover:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of service</a>{" "}
        and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};
