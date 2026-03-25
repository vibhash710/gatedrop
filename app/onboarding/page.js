import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import RoleSelector from "@/components/onboarding/RoleSelector"

export default async function OnboardingPage() {
  const session = await auth()

  if (!session) redirect("/login")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            Welcome to GateDrop
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            How are you planning to use GateDrop?
          </p>
        </div>

        <RoleSelector userName={session.user.name} />

      </div>
    </div>
  )
}