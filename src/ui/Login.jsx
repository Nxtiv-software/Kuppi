import { useForm } from "react-hook-form";
import Button from "./Button";
import { Form, Input, Label } from "./Form";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/apiUser";
import styles from "../ui/login.module.css";
import img2 from "../assets/images/img2.png";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const { mutate, isLoading: isLogin } = useMutation({
    mutationFn: (user) => loginUser(user),
    onSuccess: () => {
      console.log("login success");
      reset();
      navigate("/");
    },
    onError: (err) => console.log(err),
  });

  function onSubmit(data) {
    mutate(data);
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.formContainer}>
          <div className={styles.header}>
            <h1 className={styles.title}>Login</h1>
            <p className={styles.subtitle}>
              Don't have an account?{" "}
              <Link to={"/signup"} className={styles.signupLink}>
                Register
              </Link>
            </p>
          </div>

          <div className={styles.glassForm}>
            <Form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <div className={styles.inputGroup}>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
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

              <div className={styles.forgotPassword}>
                <span className={styles.forgotLink}>Forgot password?</span>
              </div>

              <Button
                disabled={isLogin}
                className={styles.loginButton}
                type="submit"
              >
                Log In
              </Button>
            </Form>
          </div>
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.imageContainer}>
          <img src={img2} alt="" className={styles.backgroundImage} />
        </div>
      </div>
    </div>
  );
}

export default Login;
