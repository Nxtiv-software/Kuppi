import { useForm } from "react-hook-form";
import { Form, Input, Label } from "./Form";
import { useMutation } from "@tanstack/react-query";
import { addUser } from "../services/apiUser";
import Button from "./Button";




export const SignUp = () => {
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isLoading: isAdding } = useMutation({
    mutationFn: (newUser) => addUser(newUser),
    onSuccess: () => {
      console.log("success");
      reset();
    },
    onError: (err) => console.log("Error while adding user"),
  });


  function onSubmit(data) {
    mutate(data);
  }
  return (
    <>
      <div className="h-screen grid grid-cols-2">
        <div className="h-full">
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Label>Name</Label>
            <Input type="text" id="name" {...register("name")} />
            <Label>Email</Label>
            <Input type="email" id="email" {...register("email")} />
            <Label>Password</Label>
            <Input type="password" id="password" {...register("password")} />
            <Button disabled={isAdding} variation="primary" size="medium">
          Add user
        </Button>
          </Form>
        </div>
        <div className="bg-black h-full">s</div>
      </div>
    </>
  );
};
