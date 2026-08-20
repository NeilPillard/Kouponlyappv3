import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthScreen from '../app/auth';

describe('authentication screen', () => {
  it('supports sign in, sign up, and demo access', async () => {
    const view = await render(<SafeAreaProvider initialMetrics={{frame:{x:0,y:0,width:393,height:852},insets:{top:59,left:0,right:0,bottom:34}}}><AuthScreen/></SafeAreaProvider>);
    expect(view.getByText('Welcome back')).toBeTruthy();
    await fireEvent.press(view.getByText('New to Kouponly? Create an account'));
    expect(view.getByText('Create your account')).toBeTruthy();
    expect(view.getByText('Continue in demo mode')).toBeTruthy();
  });
});
