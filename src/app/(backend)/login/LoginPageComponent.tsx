// // src/app/(backend)/login/LoginPageComponent.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function LoginPageComponent() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const callbackUrl = searchParams.get("callbackUrl") || "/backend";

//   useEffect(() => {
//     document.title = "Login | Admin Panel";
//   }, []);

//   useEffect(() => {
//     if (status === "authenticated") {
//       router.replace(callbackUrl);
//     }
//   }, [status, callbackUrl, router]);

//   if (status === "loading" || status === "authenticated") {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           fontSize: "1.2rem",
//         }}
//       >
//         {status === "loading" ? "Memeriksa sesi..." : "Mengarahkan..."}
//       </div>
//     );
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrorMessage(null);

//     try {
//       const res = await signIn("credentials", {
//         email,
//         password,
//         redirect: false,
//         callbackUrl,
//       });

//       if (res?.ok) {
//         router.push(res.url || callbackUrl);
//       } else {
//         setErrorMessage(res?.error || "Login gagal: email atau password salah");
//         setLoading(false);
//       }
//     } catch (err: any) {
//       setErrorMessage("Terjadi error saat login. Cek console untuk detail.");
//       console.error("Unexpected login error:", err);
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#f5f7fa",
//         padding: "1rem",
//       }}
//     >
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           backgroundColor: "#fff",
//           padding: "2rem",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           width: "100%",
//           maxWidth: "400px",
//         }}
//       >
//         <h2
//           style={{
//             marginBottom: "1.5rem",
//             textAlign: "center",
//             color: "#333",
//           }}
//         >
//           Login
//         </h2>

//         {errorMessage && (
//           <div
//             style={{
//               marginBottom: "1rem",
//               padding: "0.75rem",
//               backgroundColor: "#ffe5e5",
//               color: "#d8000c",
//               borderRadius: "4px",
//               textAlign: "center",
//             }}
//           >
//             {errorMessage}
//           </div>
//         )}

//         <label
//           htmlFor="email"
//           style={{
//             display: "block",
//             marginBottom: "0.5rem",
//             fontWeight: 600,
//             color: "#555",
//           }}
//         >
//           Email
//         </label>
//         <input
//           id="email"
//           type="email"
//           placeholder="Masukkan email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{
//             width: "100%",
//             padding: "0.75rem",
//             marginBottom: "1.5rem",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//             fontSize: "1rem",
//             boxSizing: "border-box",
//           }}
//           disabled={loading}
//         />

//         <label
//           htmlFor="password"
//           style={{
//             display: "block",
//             marginBottom: "0.5rem",
//             fontWeight: 600,
//             color: "#555",
//           }}
//         >
//           Password
//         </label>
//         <input
//           id="password"
//           type="password"
//           placeholder="Masukkan password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{
//             width: "100%",
//             padding: "0.75rem",
//             marginBottom: "1.5rem",
//             borderRadius: "4px",
//             border: "1px solid #ccc",
//             fontSize: "1rem",
//             boxSizing: "border-box",
//           }}
//           disabled={loading}
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             width: "100%",
//             padding: "0.75rem",
//             backgroundColor: loading ? "#999" : "#0070f3",
//             color: "#fff",
//             border: "none",
//             borderRadius: "4px",
//             fontSize: "1rem",
//             fontWeight: 600,
//             cursor: loading ? "not-allowed" : "pointer",
//             transition: "background-color 0.3s ease",
//           }}
//         >
//           {loading ? "Loading..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPageComponent() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const callbackUrl = searchParams.get("callbackUrl") || "/backend";

  useEffect(() => {
    document.title = "Login | Admin Panel";
  }, []);

  useEffect(() => {
    if (status === "authenticated") router.replace(callbackUrl);
  }, [status, callbackUrl, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center text-lg">
        {status === "loading" ? "Memeriksa sesi..." : "Mengarahkan..."}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.ok) router.push(res.url || callbackUrl);
      else {
        setErrorMessage(res?.error || "Login gagal: email atau password salah");
        setLoading(false);
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setErrorMessage("Terjadi error saat login.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
      >
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Login
        </h2>

        {errorMessage && (
          <div className="mb-4 rounded bg-red-100 p-3 text-center text-red-700">
            {errorMessage}
          </div>
        )}

        <label className="block mb-2 font-medium text-gray-600" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="mb-4 w-full rounded border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />

        <label className="block mb-2 font-medium text-gray-600" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="mb-6 w-full rounded border border-gray-300 p-3 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full rounded bg-blue-600 py-3 text-white transition-colors duration-300 ${
            loading ? "cursor-not-allowed bg-gray-400" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
