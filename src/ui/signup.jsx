import { useForm } from "react-hook-form";
import { Form, Input, Label } from "./Form";
import { useMutation } from "@tanstack/react-query";
import { addUser } from "../services/apiUser";
import Button from "./Button";
import styles from "../ui/signup.module.css";  
import img2 from "../assets/images/img2.png"; 

export const SignUp = () => {
  const { register, handleSubmit, reset } = useForm();

  const { mutate, isLoading: isAdding } = useMutation({
    mutationFn: (newUser) => addUser(newUser),
    onSuccess: () => {
      console.log("success");
      reset();
    },
    onError: (err) => console.log("Error while adding user" + err),
  });

  function onSubmit(data) {
    mutate(data);
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.imageContainer}>
          <img src={img2} alt="" className={styles.backgroundImage} />
          <div className={styles.dots}>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot + ' ' + styles.activeDot}></span>
          </div>
        </div>
      </div>
      
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Create an account</h1>
            <p className={styles.subtitle}>
              Already have an account? <span className={styles.loginLink}>Log in</span>
            </p>
          </div>

          <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <Input 
                  type="text" 
                  id="name" 
                  placeholder="First Name"
                  className={styles.input}
                  {...register("name")} 
                />
              </div>
              <div className={styles.inputGroup}>
                <Input 
                  type="text" 
                  id="lastName" 
                  placeholder="Last Name"
                  className={styles.input}
                  {...register("lastName")} 
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <Input 
                type="email" 
                id="email" 
                placeholder="Email"
                className={styles.input}
                {...register("email")} 
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.passwordContainer}>
                <Input 
                  type="password" 
                  id="password" 
                  placeholder="Enter your password"
                  className={styles.input}
                  {...register("password")} 
                />
                <span className={styles.eyeIcon}>👁️</span>
              </div>
            </div>

            <div className={styles.checkboxContainer}>
              <input 
                type="checkbox" 
                id="terms" 
                className={styles.checkbox}
              />
              <label htmlFor="terms" className={styles.checkboxLabel}>
                I agree to the <span className={styles.termsLink}>terms & conditions</span>
              </label>
            </div>

            <Button 
              disabled={isAdding} 
              className={styles.createButton}
              type="submit"
            >
              Create account
            </Button>

          </Form>
        </div>
      </div>
    </div>
  );
};