import { useState } from "react";
import { authClient } from "../lib/authClient";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
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
    await authClient.signIn.social({ provider: "google" });
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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
        <h1 className="text-3xl font-black text-blue-500 mb-6 text-center">
          RivalRec
        </h1>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-white text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-all mb-6 cursor-pointer"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="px-3 text-gray-400 text-sm">or email</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-sm text-center">
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
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
              />
              <input
                required
                type="text"
                name="username"
                placeholder="Unique Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
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
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all cursor-pointer"
          >
            {isRegistering ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6 text-sm">
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            {isRegistering ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
