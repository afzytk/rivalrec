import { useState } from "react";
import { authClient } from "../lib/authClient";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 1. Google Login Handler
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin + "/dashboard",
      });
    } catch (err) {
      setIsGoogleLoading(false);
      setError(err.message || "Failed to connect to Google.");
    }
  };

  // 2. Email Login/Signup Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        // Sign Up Flow
        const { error } = await authClient.signUp.email({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          username: formData.username,
        });
        if (error) throw new Error(error.message);
      } else {
        // Log In Flow
        const { error } = await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw new Error(error.message);
      }

      window.location.reload();
    } catch (err) {
      setError(err.message || "Authentication failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-black text-blue-500">
          RivalRec
        </h1>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading}
          className="mb-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white py-3 font-bold text-gray-900 transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isGoogleLoading ? (
            <span className="animate-pulse">Connecting to Google...</span>
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
              Continue with Google
            </>
          )}
        </button>

        <div className="my-6 flex items-center">
          <div className="grow border-t border-gray-600"></div>
          <span className="px-3 text-sm text-gray-400">or email</span>
          <div className="grow border-t border-gray-600"></div>
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-500/20 p-3 text-center text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <input
                required
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white"
              />
              <input
                required
                type="text"
                name="username"
                placeholder="Unique Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white"
              />
            </>
          )}
          <input
            required
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white"
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white"
          />

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-blue-600 py-3 font-bold text-white transition-all hover:bg-blue-500"
          >
            {isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="cursor-pointer text-blue-400 hover:underline"
          >
            {isRegistering ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
