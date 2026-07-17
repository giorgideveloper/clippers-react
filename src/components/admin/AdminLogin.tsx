import { FormEvent, useState } from "react";
import { Lock, LogIn, LoaderCircle, AlertCircle } from "lucide-react";

interface AdminLoginProps {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (username: string, password: string) => Promise<void>;
  onBack: () => void;
}

export function AdminLogin({
  isSubmitting,
  error,
  onSubmit,
  onBack,
}: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit(username.trim(), password);
  };

  return (
    <div className="min-h-screen bg-[#0F0F10] text-[#E4E4E7] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#141416] border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-amber-400" />
          <p className="text-[11px] uppercase tracking-widest font-mono text-amber-400">
            Owner Authentication
          </p>
        </div>

        <h1 className="text-2xl font-light uppercase tracking-wider text-stone-100">
          Dashboard Login
        </h1>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          Sign in to access booking and barber management tools.
        </p>

        {error && (
          <div className="mb-4 flex items-start gap-2 text-xs border border-red-500/30 bg-red-950/30 text-red-300 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-[11px] font-mono text-stone-400 uppercase tracking-wide"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full h-11 rounded-lg border border-stone-800 bg-stone-900 px-3 text-sm text-stone-100 outline-none focus:border-amber-500/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-[11px] font-mono text-stone-400 uppercase tracking-wide"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full h-11 rounded-lg border border-stone-800 bg-stone-900 px-3 text-sm text-stone-100 outline-none focus:border-amber-500/50"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-lg bg-amber-500 text-stone-950 text-xs uppercase tracking-widest font-black flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="w-4 h-4 animate-spin" />
                Signing in
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign in
              </>
            )}
          </button>
        </form>

        <button
          onClick={onBack}
          className="mt-4 w-full h-10 rounded-lg border border-stone-800 text-stone-400 text-[11px] uppercase tracking-widest font-mono hover:text-stone-200 hover:bg-stone-900"
          type="button"
        >
          Back to booking
        </button>
      </div>
    </div>
  );
}
