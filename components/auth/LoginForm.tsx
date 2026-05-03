"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock } from "lucide-react";

import { loginSchema, type LoginFormValues } from "@/lib/validations/auth";
import { loginAction } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg("");
    setSuccessMsg("");

    const result = await loginAction(data.email, data.password);

    if (result.success) {
      setSuccessMsg(result.message);
      reset();
      setTimeout(() => {
        if (onSuccess) onSuccess();
        window.location.reload();
      }, 1000);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
          <Lock className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg border border-green-100">
          {successMsg}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            {...register("email")}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            className={`pl-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            {...register("password")}
          />
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !!successMsg}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md active:scale-[0.98] transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Mengecek...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-gray-600 pt-2">
        Don&apos;t have an account?{" "}
        <a href="#" className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
          Create one
        </a>
      </p>
    </form>
  );
}
