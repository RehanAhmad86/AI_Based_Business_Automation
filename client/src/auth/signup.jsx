
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/userSlice";


export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  // const [image, setImage] = useState("https://i.pravatar.cc/300");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate(); // Use useNavigate hook for navigation
  const dispatch = useDispatch();
  //const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }), // Add name and password here
      });

      const data = await res.json();
      console.log("Server response:", data);
      if (!res.ok) {
        setError(data?.error || "Email signup failed");
        return;
      }

      if (!data.user) {
        setError("Signup failed: No user returned");
        return;
      }

      // Assuming the response has user data to sign in
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch(signInSuccess(data.user));
      navigate("/"); // Navigate to home after signup
    } catch (error) {
      setError("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleEmailSignup} className="w-80 space-y-4">
        <h2 className="text-2xl font-bold text-center">Create Account</h2>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4">
          <div
            className="bg-gray-200 p-3 rounded-full cursor-pointer hover:bg-gray-300"
            // onClick={handleGithubSignIn}
          >
            <FaGithub className="text-xl" />
          </div>
          <div
            className="bg-gray-200 p-3 rounded-full cursor-pointer hover:bg-gray-300"
            // onClick={handleGoogleSignIn}
          >
            <FcGoogle className="text-xl" />
          </div>
          <div
            className="bg-gray-200 p-3 rounded-full cursor-pointer hover:bg-gray-300"
            // onClick={handleEmailSignup}
          >
            <MdEmail className="text-xl text-red-500" />
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">or</div>

        {/* Name Field */}
        <div className="input-container">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
            placeholder=" "
            required
          />
          <label className="floating-label">Full Name</label>
        </div>

        {/* Email Field */}
        <div className="input-container">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder=" "
            required
          />
          <label className="floating-label">Email Address</label>
        </div>

        {/* Password Field */}
        <div className="input-container">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder=" "
            required
          />
          <label className="floating-label">Password</label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-white text-green-600 p-2 rounded border"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
  );
}




















// import {
//   GithubAuthProvider,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { auth } from "../lib/firebase";







// import { useState } from "react";
// import { useHistory } from "react-router-dom"; // React Router for navigation
// import AuthLayout from "../AuthLayout";
// import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";
// import { MdEmail } from "react-icons/md";
// import { useDispatch } from "react-redux";
// // import { signInSuccess } from "../../redux/slices/userSlice";
// import { signInSuccess } from "../redux/userSlice";

// import {
//   GithubAuthProvider,
//   GoogleAuthProvider,
//   signInWithPopup,
// } from "firebase/auth";
// import { auth } from "../../lib/firebase";

// export default function SignUpPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [image, setImage] = useState("https://i.pravatar.cc/300");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const history = useHistory(); // Replacing Next.js's useRouter with useHistory
//   const dispatch = useDispatch();

//   const handleGoogleSignIn = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       provider.setCustomParameters({ prompt: "select_account" });
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       const res = await fetch("/api/auth/google", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           firebaseUid: user.uid,
//           displayName: user.displayName,
//           email: user.email,
//           photoURL: user.photoURL,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to save user to database");
//       }

//       const data = await res.json();
//       dispatch(signInSuccess(data.user));
//       history.push("/dashboard");
//     } catch (error) {
//       console.error("Google Sign-In Error:", error);
//       setError("Google Sign-In failed.");
//     }
//   };

//   const handleGithubSignIn = async () => {
//     try {
//       const githubProvider = new GithubAuthProvider();
//       githubProvider.addScope("user:email");
//       const result = await signInWithPopup(auth, githubProvider);
//       const credential = GithubAuthProvider.credentialFromResult(result);
//       const user = result.user;

//       if (!credential) {
//         throw new Error("GitHub credential is missing.");
//       }

//       const idToken = await user.getIdToken();
//       const userEmail = user.email || `github-${user.uid}@github.com`;
//       const photoURL = user.photoURL;

//       const res = await fetch("/api/auth/github", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           firebaseUid: user.uid,
//           displayName: user.displayName,
//           email: userEmail,
//           photoURL: photoURL,
//           idToken,
//         }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to save user to database");
//       }

//       const data = await res.json();
//       dispatch(signInSuccess(data.user));
//       history.push("/dashboard");
//     } catch (error) {
//       console.error("GitHub Sign-In Error:", error);
//       setError("GitHub Sign-In failed.");
//     }
//   };

//   const handleEmailSignup = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("http://localhost:3000/api/auth/email/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }), // Add name and password here
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data?.error || "Email signup failed");
//         return;
//       }

//       // Assuming the response has user data to sign in
//       dispatch(signInSuccess(data.user));
//       localStorage.setItem("user", JSON.stringify(data.user));
//       history.push("/"); // Navigate to home after signup
//     } catch (error) {
//       setError("An error occurred during signup");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const res = await fetch("/api/auth/signup", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         name,
//         email,
//         password,
//         image,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       setError(data?.message || "Signup failed");
//     } else {
//       localStorage.setItem('user', JSON.stringify({ email, id: data.userId }));
//       history.push("/dashboard");
//     }

//     setLoading(false);
//   };

//   return (
//     <AuthLayout>
//       <form onSubmit={handleEmailSignup} className="w-80 space-y-4">
//         <h2 className="text-2xl font-bold text-center">Create Account</h2>

//         {/* Social Icons */}
//         <div className="flex justify-center space-x-4">
//           <div
//             className="bg-gray-200 p-3 rounded-full cursor-pointer hover:bg-gray-300"
//             onClick={handleGithubSignIn}
//           >
//             <FaGithub className="text-xl" />
//           </div>
//           <div
//             className="bg-gray-200 p-3 rounded-full cursor-pointer hover:bg-gray-300"
//             onClick={handleGoogleSignIn}
//           >
//             <FcGoogle className="text-xl" />
//           </div>
//           <div
//             className="bg-gray-200 p-3 rounded-full cursor-pointer hover:bg-gray-300"
//             onClick={handleEmailSignup}
//           >
//             <MdEmail className="text-xl text-red-500" />
//           </div>
//         </div>

//         <div className="text-center text-sm text-gray-500">or</div>

//         {/* Name Field */}
//         <div className="input-container">
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="input-field"
//             placeholder="&nbsp;"
//             required
//           />
//           <label className="floating-label">Full Name</label>
//         </div>

//         {/* Email Field */}
//         <div className="input-container">
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="input-field"
//             placeholder="&nbsp;"
//             required
//           />
//           <label className="floating-label">Email Address</label>
//         </div>

//         {/* Password Field */}
//         <div className="input-container">
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="input-field"
//             placeholder="&nbsp;"
//             required
//           />
//           <label className="floating-label">Password</label>
//         </div>

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         <button
//           type="submit"
//           className="w-full bg-white text-green-600 p-2 rounded border"
//           disabled={loading}
//         >
//           {loading ? "Signing up..." : "Sign Up"}
//         </button>
//       </form>
//     </AuthLayout>
//   );
// }


// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   const res = await fetch("/api/auth/signup", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       name,
//       email,
//       password,
//       image,
//     }),
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     setError(data?.message || "Signup failed");
//   } else {
//     localStorage.setItem('user', JSON.stringify({ email, id: data.userId }));
//     navigate("/dashboard"); // Use navigate instead of history.push
//   }

//   setLoading(false);
// };




// const handleGoogleSignIn = async () => {
//   try {
//     const provider = new GoogleAuthProvider();
//     provider.setCustomParameters({ prompt: "select_account" });
//     const result = await signInWithPopup(auth, provider);
//     const user = result.user;
//     const res = await fetch("/api/auth/google", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         firebaseUid: user.uid,
//         displayName: user.displayName,
//         email: user.email,
//         photoURL: user.photoURL,
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to save user to database");
//     }

//     const data = await res.json();
//     dispatch(signInSuccess(data.user));
//     navigate("/dashboard"); // Use navigate instead of history.push
//   } catch (error) {
//     console.error("Google Sign-In Error:", error);
//     setError("Google Sign-In failed.");
//   }
// };

// const handleGithubSignIn = async () => {
//   try {
//     const githubProvider = new GithubAuthProvider();
//     githubProvider.addScope("user:email");
//     const result = await signInWithPopup(auth, githubProvider);
//     const credential = GithubAuthProvider.credentialFromResult(result);
//     const user = result.user;

//     if (!credential) {
//       throw new Error("GitHub credential is missing.");
//     }

//     const idToken = await user.getIdToken();
//     const userEmail = user.email || `github-${user.uid}@github.com`;
//     const photoURL = user.photoURL;

//     const res = await fetch("/api/auth/github", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         firebaseUid: user.uid,
//         displayName: user.displayName,
//         email: userEmail,
//         photoURL: photoURL,
//         idToken,
//       }),
//     });

//     if (!res.ok) {
//       throw new Error("Failed to save user to database");
//     }

//     const data = await res.json();
//     dispatch(signInSuccess(data.user));
//     navigate("/dashboard"); // Use navigate instead of history.push
//   } catch (error) {
//     console.error("GitHub Sign-In Error:", error);
//     setError("GitHub Sign-In failed.");
//   }
// };
