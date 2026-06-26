import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginForm } from "../core/loginSchema";
import { login, isAuthenticated } from "../data/authService";
import {
  useLocation,
  useNavigate,
  Navigate,
  NavLink,
  type Location as RouterLocation,
} from "react-router";
import { Input, Button, Divider, Footer } from "../../Common/index.ts";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from as RouterLocation | undefined;
  const redirectTo = from
    ? `${from.pathname}${from.search}${from.hash}`
    : "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  const onSubmit = (data: LoginForm) => {
    const success = login(data.username, data.password);

    if (!success) {
      setError("root", { message: "Invalid username or password" });
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">

      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">

        <div className="mx-auto w-full sm:max-w-md  px-8 py-8 bg-zinc-900/40 backdrop-blur-md shadow-2xl ring-1 ring-white/10 sm:rounded-xl">

          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-violet-600">
              CineView
            </h1>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Sign in to your account
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                id="username"
                label="Email address"
                type="text"
                autoComplete="email"
                placeholder="name@example.com"
                error={errors.username?.message}
                {...register("username")}
              />

              <Input
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />

              {"root" in errors && (
                <div className="rounded-lg bg-red-50 p-2.5 border border-red-200">
                  <p className="text-xs font-medium text-red-600 text-center">
                    {errors.root?.message as string}
                  </p>
                </div>
              )}

              <Button type="submit" fullWidth color="#7c3aed">
                Sign in
              </Button>
            </form>

            <Divider>Or sign in with</Divider>

            <div className="grid grid-cols-2 gap-3">
              <Button type="button" variant="secondary" className="gap-2 items-center">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                Google
              </Button>

              <Button type="button" variant="secondary" className="gap-2 items-center">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94 1.08.08 2.15-.52 2.81-1.33z" />
                </svg>
                Apple
              </Button>
            </div>
          </div>

        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <NavLink to="/signup" className="font-semibold text-violet-300 hover:text-violet-200 transition-colors">
            Sign up
          </NavLink>
        </p>
      </div>

      <Footer />
    </div>
  );
}
