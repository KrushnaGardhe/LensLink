import React, { useState } from "react";
import { useStore } from "../store/useStore";

const Login = () => {
  const [username, setUsername] = useState("");
  const login = useStore((state) => state.login);

  const submit = (e) => {
    e.preventDefault();
    if (username.trim().length >= 3) {
      login(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm border border-neutral-200 rounded-lg p-4">
        <h1 className="text-lg font-semibold mb-4 text-gray-900">
          sign in
        </h1>

        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              username
            </label>
            <input
              autoFocus
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your name"
              className="w-full border border-neutral-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={username.trim().length < 3}
            className="w-full border rounded px-3 py-1.5 text-sm disabled:opacity-40"
          >
            continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
