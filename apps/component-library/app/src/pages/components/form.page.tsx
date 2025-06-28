// import { useEffect, useState } from 'react';
// import { Controller, useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useUpdateUserMutation } from '@shared/state-management';

// import styled from '@emotion/styled';
// import { 
//   Button,
//   ButtonVariants,
//   Input,
//   InputVariants
// } from '@shared/components';

// import { useNavigate } from 'react-router-dom';
// import { Path } from '../../models/paths';

// const Container = styled.div`
//   position: absolute;
//   inset: 0;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   flex-grow: 1;
//   background-color: var(--color-background);
// `;

// const FormContainer = styled.div`
//   /* background-color: rgba(var(--color-secondary-opacity), 0.2); */
//   padding: 40px;
//   border-radius: 8px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
//   width: 300px;

//   form {
//     .title {
//       display: flex;
//       flex-direction: column;
//       align-items: center;

//       h1 {
//         font-size: 2.5rem;
//         color: var(--color-primary);
//         font-weight: 600;
//       }

//       h2 {
//         font-size: 1.6rem;
//         color: var(--color-secondary);
//         font-weight: 600;
//       }

//       h3 {
//         font-size: 1.2rem;
//         color: var(--color-text);
//         font-weight: 600;
//       }

//       user-select: none;
//     }
//   }
// `;

// const ErrorText = styled.p`
//   color: red;
//   font-size: 1.2rem;
//   line-height: 1.2rem;
//   text-align: center;
// `;

// // Zod validation schema for form
// const schema = z.object({
//   displayName: z.string().nonempty('Name is required'),
// });

// type FormData = z.infer<typeof schema>;

// interface UpdateUserDetailsProps {
//   isMobile: boolean;
// }

// export const UpdateUserDetails = ({ isMobile }: UpdateUserDetailsProps) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     control,
//   } = useForm<FormData>({
//     resolver: zodResolver(schema),
//   });
//   // const navigate = useNavigate();
//   const [user, setUser] = useState<{id: string, username: string} | null>(null)
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   if (!user) return <div>Loading...</div>;

//   const handleUpdateUser = async (data: FormData) => {
//     try {
//       const res = await setUser({
//         id: user?.id,
//         username: data.displayName,
//       });

//       // On Success Navigate
//       // if (res.data) {
//       //   alert(`Success: ${JSON.stringify(res.data)}`);
//       //   // navigate(Path.HOME);
//       // }

//       // Check for error in response
//       // if (res.error) {
//       //   const errorDetails = res.error.data;
//       //   if (errorDetails) {
//       //     setErrorMessage(errorDetails);
//       //   } else {
//       //     setErrorMessage(
//       //       'An error occurred during login. Please contact support'
//       //     );
//       //   }
//       // }

//     } catch (error: unknown | {message: string}) {
//       console.error('Login Error:', error); // Log error details
//       setErrorMessage(
//         JSON.stringify(error?.message) || 'An unknown error occurred during login.'
//       );
//     }
//   };

//   return (
//     <Container>
//       <FormContainer>
//         <form onSubmit={handleSubmit(handleUpdateUser)}>
//           <div className="title">
//             <h1>Hi,</h1>
//             <h2>Nice to meet you!</h2>
//             <h3>What would you like to be called?</h3>
//           </div>
//           <Controller
//             name="displayName"
//             control={control}
//             defaultValue=""
//             render={({ field }) => (
//               <Input
//                 variant={InputVariants.FORM}
//                 type="text"
//                 placeholder="Name"
//                 {...field}
//                 isMobile={isMobile}
//               />
//             )}
//           />
//           {errors.displayName && (
//             <ErrorText>{errors.displayName.message}</ErrorText>
//           )}

//           <Button
//             type="submit"
//             disabled={isLoading}
//             variant={ButtonVariants.FORM}
//             isMobile={isMobile}
//           >
//             {isLoading ? 'Loading...' : 'CONFIRM'}
//           </Button>

//           {isError && <ErrorText>{errorMessage}</ErrorText>}
//         </form>
//       </FormContainer>
//     </Container>
//   );
// };
