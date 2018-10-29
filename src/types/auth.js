// @flow

export type AuthForm = {|
  password: string,
  email: string,
  phone: string,
  confirmCode: string,
|}

export type SignIn = {|
  password: string,
  email?: string,
  phone?: string,
|}

export type EmailParams = {|
  password: string,
  email: string,
  role: string,
|};

export type PhoneParams = {|
  password: string,
  phone: string,
  role: string,
|};

export type VerificationParams = {|
  confirmCode: string,
  type: string,
  phone?: string,
  email?: string,
|};
