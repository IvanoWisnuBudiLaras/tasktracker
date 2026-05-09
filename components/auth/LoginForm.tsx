"use client";
import Modal from "@/components/Modal";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, User as UserIcon } from "lucide-react";

import { loginSchema, registerSchema, type LoginFormValues, type RegisterFormValues } from "@/lib/validations/auth";
import { loginAction, registerAction } from "@/actions/auth.actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");

  // Reset to login mode when modal opens
  useEffect(() => {
    if (isOpen) setMode("login");
  }, [isOpen]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === "login" ? "Welcome back" : "Create an account"}
    >
      <AuthForm mode={mode} setMode={setMode} onSuccess={onClose} />
    </Modal>
  );
}

interface AuthFormProps {
  mode: "login" | "register";
  setMode: (mode: "login" | "register") => void;
  onSuccess?: () => void;
}

function AuthForm({ mode, setMode, onSuccess }: AuthFormProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const schema = mode === "login" ? loginSchema : registerSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: "",
      email: "",
      password: "",
    },
  });

  // Reset form and messages when mode changes
  useEffect(() => {
    reset();
    setErrorMsg("");
    setSuccessMsg("");
  }, [mode, reset]);

  const onSubmit = async (data: any) => {
    setErrorMsg("");
    setSuccessMsg("");

    let result;
    if (mode === "login") {
      result = await loginAction(data.email, data.password);
    } else {
      result = await registerAction(data.nama, data.email, data.password);
    }

    if (result.success) {
      setSuccessMsg(result.message);
      reset();
      
      if (mode === "register") {
        // Switch to login after successful registration
        setTimeout(() => {
          setMode("login");
          setSuccessMsg(""); // clear it so user can login cleanly
        }, 1500);
      } else {
        // Close modal and reload page on successful login
        setTimeout(() => {
          if (onSuccess) onSuccess();
          window.location.reload();
        }, 1000);
      }
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

      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="nama">Full Name</Label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              id="nama"
              placeholder="John Doe"
              className={`pl-10 ${errors.nama ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              {...register("nama")}
            />
          </div>
          {errors.nama && (
            <p className="text-xs text-red-500 font-medium">{errors.nama?.message as string}</p>
          )}
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
          <p className="text-xs text-red-500 font-medium">{errors.email?.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {mode === "login" && (
            <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Forgot password?
            </a>
          )}
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
          <p className="text-xs text-red-500 font-medium">{errors.password?.message as string}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || (mode === "login" && !!successMsg)}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md active:scale-[0.98] transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "login" ? "Mengecek..." : "Mendaftar..."}
          </>
        ) : mode === "login" ? (
          "Sign in"
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-center text-sm text-gray-600 pt-2">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("register")}
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => setMode("login")}
              className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </button>
          </>
        )}
      </p>
    </form>
  );
}
