import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import {
  validateUsername,
  validateEmail,
  validatePassword,
  validateFullName,
} from "../utils/validation";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateUsername(form.username)) {
      setError("Username must be 3-20 characters");
      return;
    }

    if (!validateEmail(form.email)) {
      setError("Please enter a valid email");
      return;
    }

    if (!validatePassword(form.password)) {
      setError("Password must contain at least 6 characters");
      return;
    }

    if (!validateFullName(form.fullName)) {
      setError("Full name must contain at least 2 characters");
      return;
    }

    setLoading(true);

    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        avatar: "",
      });

      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-3xl font-bold">
          Register
        </h1>

        {error && (
          <p className="rounded bg-red-100 p-3 text-red-600">
            {error}
          </p>
        )}

        <div>
          <label className="mb-1 block">Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full rounded border p-3"
            placeholder="Full name"
          />
        </div>

        <div>
          <label className="mb-1 block">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full rounded border p-3"
            placeholder="Username"
          />
        </div>

        <div>
          <label className="mb-1 block">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded border p-3"
            placeholder="Email address"
          />
        </div>

        <div>
          <label className="mb-1 block">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded border p-3"
            placeholder="Password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 p-3 text-white hover:bg-blue-700"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;