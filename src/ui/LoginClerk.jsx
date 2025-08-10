import { SignIn } from "@clerk/clerk-react";

function LoginClerk() {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <SignIn />
      </div>
    </>
  );
}

export default LoginClerk;
