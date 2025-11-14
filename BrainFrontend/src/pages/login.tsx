import type { JSX } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signin } from "../api/user.api";
import { useNavigate } from "react-router-dom";

interface ISignIn {
    email: string,
    password: string
}
export const SignIn = (): JSX.Element => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isLoading } } = useForm<ISignIn>();
    const login: SubmitHandler<ISignIn> = async (data) => {
        const signinStatus = await signin(data);
        if (signinStatus.success) {
            navigate('/');
        } else {
            console.log("user singin failed");
        }
    }

    return (
        <>
            <div className="flex flex-col items-center h-screen ">
                {isLoading ? <h1>Loading..</h1> :
                    <form
                        className="my-auto flex flex-col gap-4 border-1 border-black p-12 w-full max-w-md bg-white rounded-lg shadow-lg"
                        onSubmit={handleSubmit(login)}>
                        <h1 className="mx-auto text-2xl text-center font- mb-4">Login</h1>
                        <input
                            className="border-2 border-black rounded-lg p-1"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            {
                            ...register("email",
                                {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                }
                            )
                            }
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                        <input
                            className="password border-2 border-black rounded-lg  p-1"
                            type="password"
                            autoComplete="current-password"
                            placeholder="enter the password"
                            {
                            ...register("password",
                                {
                                    required: "Password is rquired",
                                    minLength: { value: 6, message: 'invlaid password' }
                                }
                            )
                            }
                        />
                        {errors.email && <p>{errors.email.message}</p>}
                        <input
                            className="border-2 border-black rounded-lg w-fit mx-auto p-1"
                            type="submit" />
                    </form>
                }
            </div>
        </>
    )
}