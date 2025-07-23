import { useForm } from "react-hook-form"
import Button from "./Button"
import { Form, Input, Label } from "./Form"
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/apiUser";

function Login() {
    const {register, handleSubmit, reset} = useForm();

    const {mutate, isLoading: isLogin} = useMutation({
        mutationFn: (user) => loginUser(user),
        onSuccess: () => {
            console.log("login success");
            reset();
        },
        onError: (err) => console.log(err)
    })

    function onSubmit(data) {
        mutate(data);
    }

    return (
        <div className="h-screen grid grid-cols-2">
            <div className="h-full">
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Label>Email</Label>
                    <Input type="email" id="email" {...register("email")}/>
                    <Label>Password</Label>
                    <Input type="password" id="password" {...register("password")}/>
                    <Button disabled={isLogin} variation="primary" size="medium">LogIn</Button>
                </Form>
            </div>
            <div className="bg-black h-full"></div>
        </div>
    )
}

export default Login
