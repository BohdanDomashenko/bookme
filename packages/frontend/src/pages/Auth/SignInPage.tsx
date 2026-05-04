import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Alert, Anchor, Button, Container, Paper, Stack, TextInput, Title } from '@mantine/core';
import { isAxiosError } from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../../common/api';
import { ROUTES } from '../../common/constants/route.constants';
import { otpVerifySchema, type OTPVerifySchema } from '@packages/contracts';

function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || 'Request failed. Please try again.';
  }

  return 'Unexpected error. Please try again.';
}

export function SignInPage() {
  const [otpRequested, setOtpRequested] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OTPVerifySchema>({
    resolver: zodResolver(otpVerifySchema),
    defaultValues: {
      email: '',
      code: '',
    },
  });

  const requestOtpMutation = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: () => {
      setOtpRequested(true);
      setErrorMessage(null);
    },
    onError: (error: unknown) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data) => {
      setVerifiedToken(data.access_token);
      setErrorMessage(null);
    },
    onError: (error: unknown) => {
      setErrorMessage(getErrorMessage(error));
    },
  });

  const requestOtp = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) {
      return;
    }

    const email = getValues('email');

    if (!email) {
      setError('email', { message: 'Email is required' });
      return;
    }

    requestOtpMutation.mutate({ email });
  };

  const verifyOtp = (values: OTPVerifySchema) => {
    const code = values.code?.trim();
    if (!code) {
      setError('code', { message: 'Code is required' });
      return;
    }

    verifyOtpMutation.mutate({
      email: values.email,
      code,
    });
  };

  return (
    <Container size='xs' py='xl'>
      <Paper withBorder shadow='sm' p='xl' radius='md'>
        <Stack gap='md'>
          <Title order={2}>Sign In</Title>

          {errorMessage && <Alert color='red'>{errorMessage}</Alert>}
          {otpRequested && (
            <Alert color='blue'>One-time code sent to your email. Enter it below to continue.</Alert>
          )}
          {verifiedToken && <Alert color='green'>Signed in successfully. Token received.</Alert>}

          <form onSubmit={handleSubmit(verifyOtp)}>
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
                name='code'
                render={({ field }) => (
                  <TextInput
                    label='OTP Code'
                    placeholder='1234'
                    error={errors.code?.message}
                    {...field}
                  />
                )}
              />

              <Button type='button' variant='default' onClick={requestOtp} loading={requestOtpMutation.isPending}>
                Send OTP Code
              </Button>

              <Button type='submit' loading={verifyOtpMutation.isPending}>
                Verify And Sign In
              </Button>
            </Stack>
          </form>

          <Anchor component={Link} to={ROUTES.AUTH_SIGN_UP}>
            Need an account? Sign up
          </Anchor>
        </Stack>
      </Paper>
    </Container>
  );
}
