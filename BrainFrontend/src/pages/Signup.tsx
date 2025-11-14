import { useForm, type SubmitHandler } from "react-hook-form"
import { signup } from "../api/user.api";
import { useNavigate } from "react-router-dom";
import type { JSX } from "react";


interface ISignUp {
    username: string,
    email: string,
    password: string
}
export const Signup = (): JSX.Element => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isLoading } } = useForm<ISignUp>();

    const userSign: SubmitHandler<ISignUp> = async (data) => {
        console.log(data.username);
        console.log(data.email);
        console.log(data.password);

        const signupStatus = await signup(data);
        if (signupStatus.success) {
            navigate('/login');
        } else {
            console.log("user login failed");
        }
    }

    return (
        <>
            {isLoading && <h1>Loading...</h1>}
            <div className="flex items-center justify-center min-h-screen">
                <form onSubmit={handleSubmit(userSign)} className="flex flex-col gap-4 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="username" className="text-sm font-medium text-gray-700">
                            Username
                        </label>
                        <input
                            id="username"
                            autoComplete="username"
                            type="text"
                            {...register('username', {
                                required: 'Username is required',
                                minLength: { value: 3, message: 'Username must be at least 3 characters' },
                                maxLength: { value: 25, message: 'Username must be less than 25 characters' }
                            })}
                            placeholder="Enter username"
                            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        />
                        {errors.username && (
                            <span className="text-red-500 text-sm">{errors.username.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            autoComplete="email"
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            placeholder="Enter your email"
                            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">{errors.email.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            autoComplete="new-password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' }
                            })}
                            placeholder="Enter password"
                            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-sm">{errors.password.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-gray-600 text-white border-2 border-gray-900 rounded-lg p-2 mt-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-colors font-medium"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </>
    )
}