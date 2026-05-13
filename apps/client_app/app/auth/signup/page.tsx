"use client";

import NextLink from "next/link";
import { useRouter as useNavigationRouter, useSearchParams } from "next/navigation";
import { Suspense, useState as useComponentState, useEffect } from "react";
import { apiClient, extractErrorMessage } from "../../../apiClient";
import { useAppContext } from "../../state/AppContext";

interface GoogleResponse {
  url: string;
}

function SignUpForm() {
  const router = useNavigationRouter();
  const searchParams = useSearchParams();
  const { login } = useAppContext();

  const [email, setEmail] = useComponentState("");
  const [username, setUsername] = useComponentState("");
  const [password, setPassword] = useComponentState("");
  const [birthdate, setBirthdate] = useComponentState("");

  const [emailError, setEmailError] = useComponentState<string | null>(null);
  const [usernameError, setUsernameError] = useComponentState<string | null>(
    null,
  );
  const [passwordError, setPasswordError] = useComponentState<string | null>(
    null,
  );
  const [birthdateError, setBirthdateError] = useComponentState<string | null>(
    null,
  );

  const [error, setError] = useComponentState<string | null>(null);
  const [isLoading, setIsLoading] = useComponentState(false);
  const [googleUrl, setGoogleUrl] = useComponentState<string | null>(null);

  useEffect(() => {
    const fetchGoogleUrl = async () => {
      try {
        const response =
          await apiClient.get<GoogleResponse>("/auth/login/google");
        setGoogleUrl(response.data.url);
      } catch (error) {
        console.error("Error fetching Google URL:", error);
      }
    };

    fetchGoogleUrl();
  }, [setGoogleUrl]);

  const validateForm = (): boolean => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters.");
      isValid = false;
    } else {
      setUsernameError(null);
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!birthdate) {
      setBirthdateError("Please enter your birthdate.");
      isValid = false;
    } else {
      setBirthdateError(null);
    }

    return isValid;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val.length > 0 && !emailRegex.test(val)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError(null);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUsername(val);

    if (val.length > 0 && val.length < 3) {
      setUsernameError("Username must be at least 3 characters.");
    } else {
      setUsernameError(null);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);

    if (val.length > 0 && val.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
    } else {
      setPasswordError(null);
    }
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setBirthdate(val);

    if (val) {
      setBirthdateError(null);
    }
  };

  const handleStandardRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const userAgent = navigator.userAgent;
      const isoBirthdate = new Date(birthdate).toISOString();

      const response = await apiClient.post("/auth/signup", {
        email,
        username,
        password,
        birthdate: isoBirthdate,
        userAgent,
      });

      const { accessToken } = response.data;
      const base64Url = accessToken.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      const payload = JSON.parse(jsonPayload);

      login({
        id: payload.userId || "",
        accountId: payload.profileId || "",
        name: username,
        role: payload.role || "user",
      });

      router.push("/");

    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.assign(`${googleUrl}`);
  };

  return (
    <div className="w-full max-w-sm bg-white p-10 rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center">
      <header className="mb-6 w-full text-center">
        <h1 className="text-3xl font-bold mb-3">Innogram</h1>
      </header>

      <button
        type="button"
        onClick={handleGoogleSignup}
        className="w-full p-3 mb-6 text-base font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition flex items-center justify-center gap-3"
      >
        <span>Sign up with Google</span>
      </button>

      <div className="w-full flex items-center text-center mb-6 before:flex-1 before:border-b before:border-gray-200 after:flex-1 after:border-b after:border-gray-200">
        <span className="px-4 text-gray-400 font-medium text-sm">OR</span>
      </div>

      <form
        onSubmit={handleStandardRegister}
        noValidate
        className="w-full space-y-4"
      >
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={handleEmailChange}
            className={`w-full p-3 text-sm border rounded-lg bg-gray-50 focus:outline-none transition ${
              emailError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-sky-400 focus:bg-white"
            }`}
            required
          />
          {emailError && (
            <p className="text-red-500 text-xs mt-1 pl-1 font-medium">
              {emailError}
            </p>
          )}
        </div>

        <div>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className={`w-full p-3 text-sm border rounded-lg bg-gray-50 focus:outline-none transition ${
              usernameError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-sky-400 focus:bg-white"
            }`}
            required
            minLength={3}
          />
          {usernameError && (
            <p className="text-red-500 text-xs mt-1 pl-1 font-medium">
              {usernameError}
            </p>
          )}
        </div>

        <div>
          <input
            id="birthdate"
            name="birthdate"
            type="date"
            placeholder="Birthdate"
            value={birthdate}
            onChange={handleBirthdateChange}
            className={`w-full p-3 text-sm border rounded-lg bg-gray-50 focus:outline-none transition ${
              birthdateError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-sky-400 focus:bg-white"
            }`}
            required
          />
          {birthdateError && (
            <p className="text-red-500 text-xs mt-1 pl-1 font-medium">
              {birthdateError}
            </p>
          )}
        </div>

        <div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className={`w-full p-3 text-sm border rounded-lg bg-gray-50 focus:outline-none transition ${
              passwordError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-sky-400 focus:bg-white"
            }`}
            required
            minLength={8}
          />
          {passwordError && (
            <p className="text-red-500 text-xs mt-1 pl-1 font-medium">
              {passwordError}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 disabled:bg-sky-300 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>

      <footer className="mt-8 text-center w-full pt-6 border-t border-gray-100">
        <p className="text-gray-600 text-sm">
          Have an account?
          <NextLink
            href="/auth/signin"
            className="text-sky-700 font-semibold hover:underline pl-1"
          >
            Log in
          </NextLink>
        </p>
      </footer>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
      <Suspense
        fallback={
          <div className="font-medium text-gray-600">Loading auth...</div>
        }
      >
        <SignUpForm />
      </Suspense>
    </main>
  );
}
