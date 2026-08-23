"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";
import { login } from "@/lib/auth";

export default function Login() {
  const router = useRouter();

  const [details, setDetails] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      setLoading(true);

      const { data, error } = await login(
        details.email,
        details.password
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      const user = data.user;

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();


      if (profileError || !profile) {
        toast.error("Profile not found");
        await supabase.auth.signOut();
        return;
      }

      toast.success("Login Successful");
      router.push("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[340px] space-y-4 rounded-2xl border p-6 theme-text">
        <h1 className="text-center text-2xl font-medium p-1">Login</h1>
        <form onSubmit={handleLogin} autoComplete="on">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border p-2 mb-4"
            name="email"
            autoComplete="email"
            value={details.email}
            onChange={handleChange}
          />

          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-2xl border p-2 pr-10"
              name="password"
              autoComplete="current-password"
              value={details.password}
              onChange={handleChange}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit"
            disabled={loading}
            className="w-full rounded-full p-2 cursor-pointer font-medium theme-text border button-bg mb-4"
          >
            {loading ? (
              <div className="flex gap-2 items-center justify-center">
                Logging In
                <Loader className="animate-spin" size={19} />
              </div>
            ) : (
              "Get Started"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
