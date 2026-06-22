// "use client"

// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSeparator,
// } from "@/components/ui/field"
// import { Input } from "@/components/ui/input"
// import { IconLayoutRows } from "@tabler/icons-react"
// import { useState } from "react"
// import { createClient } from "../utils/supabase/client"


// // 1. Import your browser client builder


// export function SignupForm({ className, ...props }) {
//   const [name, setname] = useState("")
//   const [password, setpassword] = useState("")
//   const [emai, setemai] = useState("")
  
//   // 2. State to store any auth errors or loading state
//   const [errorMsg, setErrorMsg] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const supabase = createClient()

//   // 3. Form submission logic
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setErrorMsg(null)

//     // Send data to Supabase
//     const { data, error } = await supabase.auth.signUp({
//       email: emai,
//       password: password,
//       options: {
//         data: {
//           full_name: name, // Saves the display name inside user metadata
//         }
//       }
//     })

//     setLoading(false)

//     if (error) {
//       setErrorMsg("Invalid Credential")
//       // setErrorMsg(error.message)
//     } else {
//       alert("Sign up successful! Check your email or try logging in if you turned off confirmations.")
//     }
//   }

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       {/* 4. Attach the submit handler */}
//       <form onSubmit={handleSubmit}>
//         <FieldGroup>
//           <div className="flex flex-col items-center gap-2 text-center">
//             <a href="#" className="flex flex-col items-center gap-2 font-medium">
//               <div className="flex size-8 items-center justify-center rounded-md">
//                 <IconLayoutRows className="size-6" />
//               </div>
//               <span className="sr-only">Acme Inc.</span>
//             </a>
//             <h1 className="text-xl font-bold">Welcome to Acme Inc.</h1>
//             <FieldDescription>
//               Already have an account? <a href="/login">Sign in</a>
//             </FieldDescription>
//           </div>

//           {/* Display an error banner if authentication fails */}
//           {errorMsg && (
//             <div className="rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
//               {errorMsg}
//             </div>
//           )}

//           <Field>
//             <FieldLabel htmlFor="name">Name</FieldLabel>
//             <Input onChange={(e)=>setname(e.target.value)} id="name" type="text" placeholder="John Doe" required />
//           </Field>
//           <Field>
//             <FieldLabel htmlFor="email">Email</FieldLabel>
//             <Input onChange={(e)=>setemai(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
//           </Field>
//           <Field>
//             <FieldLabel htmlFor="password">Password</FieldLabel>
//             <Input onChange={(e)=>setpassword(e.target.value)} id="password" type="password" placeholder="******" required />
//           </Field>
//           <Field>
//             {/* Disable button while loading to prevent multiple submissions */}
//             <Button type="submit" disabled={loading}>
//               {loading ? "Creating Account..." : "Create Account"}
//             </Button>
//           </Field>
//           <FieldSeparator>Or</FieldSeparator>
//           <Field className="grid gap-4 sm:grid-cols-2">
//             <Button variant="outline" type="button">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 mr-2">
//                 <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" />
//               </svg>
//               Continue with Apple
//             </Button>
//             <Button variant="outline" type="button">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 mr-2">
//                 <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
//               </svg>
//               Continue with Google
//             </Button>
//           </Field>
//         </FieldGroup>
//       </form>
//       <FieldDescription className="px-6 text-center">
//         By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
//         and <a href="#">Privacy Policy</a>.
//       </FieldDescription>
//     </div>
//   );
// }


"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLayoutRows } from "@tabler/icons-react"
import { useState } from "react"
import { createClient } from "../utils/supabase/client"
import { Wallet } from "lucide-react"

export function SignupForm({ className, ...props }) {
  const [name, setname] = useState("")
  const [password, setpassword] = useState("")
  const [emai, setemai] = useState("")
  
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  // Form submission logic (Email/Password)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const { data, error } = await supabase.auth.signUp({
      email: emai,
      password: password,
      options: {
        data: {
          full_name: name,
        }
      }
    })

    setLoading(false)

    if (error) {
      setErrorMsg(error.message || "Invalid Credentials")
    } else {
      alert("Sign up successful! Check your email or try logging in if you turned off confirmations.")
    }
  }

  // 💡 FIX: Google OAuth Logic
  const handleGoogleSignIn = async () => {
    setLoading(true)
    setErrorMsg(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Automatically matches localhost or your deployed production domain URL
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      setLoading(false)
      setErrorMsg(error.message)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a href="/" className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-8 items-center justify-center rounded-md">
                <Wallet className="size-6" />
              </div>
              <span className="sr-only">XpenseHub</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to XpenseHub</h1>
            <FieldDescription>
              Already have an account? <a href="/login">Sign in</a>
            </FieldDescription>
          </div>

          {errorMsg && (
            <div className="rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {errorMsg}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input onChange={(e)=>setname(e.target.value)} id="name" type="text" placeholder="John Doe" required disabled={loading} />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input onChange={(e)=>setemai(e.target.value)} id="email" type="email" placeholder="m@example.com" required disabled={loading} />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input onChange={(e)=>setpassword(e.target.value)} id="password" type="password" placeholder="******" required disabled={loading} />
          </Field>
          <Field>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Create Account"}
            </Button>
          </Field>
          
          <FieldSeparator>Or</FieldSeparator>
          
          <Field className="">
            {/* <Button variant="outline" type="button" disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 mr-2">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" />
              </svg>
              Continue with Apple
            </Button> */}
            
            {/* 💡 Attached click handler here */}
            <Button variant="outline" type="button" onClick={handleGoogleSignIn} disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="size-4 mr-2">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
              </svg>
              Continue with Google
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}