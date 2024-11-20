import {z} from 'zod'

export const signinSchema = z.object({
    identifier: z
      .string()
      .nonempty("Identifier is required.")
      .refine(
        (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^[a-zA-Z0-9_]+$/.test(value),
        {
          message: "Identifier must be a valid email or username.",
        }
      ),
    password: z.string().min(4, "Password must be at least 4 characters."),
  });
  

export const usernameValidation = z.string()
.min(3,"username must be atleast 3 charachters long")
.max(20, "usernme must be atleast no longer than 20 characters");


export const signUpValidation = z.object({
    username:usernameValidation,
    fullname: z.string().min(3, "fullname must be atleast 3 charachters long"),
    password: z.string().min(4, "password must be atleast 4 charachters long"),
    confirmPassword: z.string().min(4, "password must be atleast 4 charachters long"),
    avatar: z.string().url().nonempty(),
    coverImage: z.string().url().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
})