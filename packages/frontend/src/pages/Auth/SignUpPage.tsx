import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert, Anchor, Button, Container, Paper, Stack, TextInput, Title } from '@mantine/core';
import { isAxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../../common/api';
import { ROUTES } from '../../common/constants/route.constants';
import { signUpSchema, type SignUpSchema } from '@packages/contracts';
import { CountriesSelect } from '../../components/CountriesSelect/CountriesSelect';

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || 'Request failed. Please try again.';
  }

  return 'Unexpected error. Please try again.';
}

export function SignUpPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      full_name: '',
      country_code: '',
      city: '',
    },
  });

  const signUpMutation = useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      setSuccessMessage('Account created. Please continue to sign in to request OTP.');
      setErrorMessage(null);
      reset();
    },
    onError: (error: unknown) => {
      setErrorMessage(getErrorMessage(error));
      setSuccessMessage(null);
    },
  });

  const onSubmit = (values: SignUpSchema) => {
    signUpMutation.mutate(values);
  };

  return (
    <Container size='xs' py='xl'>
      <Paper withBorder shadow='sm' p='xl' radius='md'>
        <Stack gap='md'>
          <Title order={2}>Sign Up</Title>

          {errorMessage && <Alert color='red'>{errorMessage}</Alert>}
          {successMessage && <Alert color='green'>{successMessage}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap='md'>
              <Controller
                control={control}
                name='email'
                render={({ field }) => (
                  <TextInput
                    label='Email'
                    placeholder='you@example.com'
                    error={errors.email?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                control={control}
                name='full_name'
                render={({ field }) => (
                  <TextInput
                    label='Full Name'
                    placeholder='John Doe'
                    error={errors.full_name?.message}
                    {...field}
                  />
                )}
              />

              <Controller
                control={control}
                name='country_code'
                render={({ field }) => (
                  <CountriesSelect
                    value={field.value}
                    onChange={(value) => field.onChange(value || '')}
                    error={errors.country_code?.message}
                    withAsterisk
                  />
                )}
              />

              <Controller
                control={control}
                name='city'
                render={({ field }) => (
                  <TextInput
                    label='City'
                    placeholder='Berlin'
                    error={errors.city?.message}
                    {...field}
                  />
                )}
              />

              <Button type='submit' loading={signUpMutation.isPending}>
                Create Account
              </Button>
            </Stack>
          </form>

          <Anchor component={Link} to={ROUTES.AUTH_SIGN_IN}>
            Already have an account? Sign in
          </Anchor>
        </Stack>
      </Paper>
    </Container>
  );
}
