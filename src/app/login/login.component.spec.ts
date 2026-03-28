import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  it('should render email and password inputs', async () => {
    const { locateEmail, locatePassword } = setup();
    const email = await locateEmail();
    await expect.element(email).toBeVisible();
    const password = await locatePassword();
    await expect.element(password).toBeVisible();
  });

  it('should not show errors before fields are touched', async () => {
    setup();
    const errors = page.getByRole('paragraph');
    await expect.element(errors).not.toBeInTheDocument();
  });

  it('should show required errors when submitting empty form', async () => {
    const { locateSubmit } = setup();
    const submit = await locateSubmit();
    await submit.click();
    const emailError = page.getByText('Email is required');
    await expect.element(emailError).toBeVisible();
    const passwordError = page.getByText('Password is required');
    await expect.element(passwordError).toBeVisible();
  });

  it('should show email validation error for invalid email', async () => {
    const { locateEmail, locateSubmit } = setup();
    const email = await locateEmail();
    await email.fill('not-an-email');
    const submit = await locateSubmit();
    await submit.click();
    const error = page.getByText('Please enter a valid email address');
    await expect.element(error).toBeVisible();
  });

  it('should show min length error for short password', async () => {
    const { locatePassword, locateSubmit } = setup();
    const password = await locatePassword();
    await password.fill('short');
    const submit = await locateSubmit();
    await submit.click();
    const error = page.getByText('Password must be at least 12 characters');
    await expect.element(error).toBeVisible();
  });

  it('should submit successfully with valid credentials', async () => {
    const { locateEmail, locatePassword, locateSubmit } = setup();
    const email = await locateEmail();
    await email.fill('test@example.com');
    const password = await locatePassword();
    await password.fill('securepassword');
    const submit = await locateSubmit();
    await submit.click();
    const errors = page.getByRole('paragraph');
    await expect.element(errors).not.toBeInTheDocument();
  });
});

function setup() {
  TestBed.configureTestingModule({});
  TestBed.createComponent(LoginComponent);

  async function locateEmail() {
    const input = page.getByLabelText('Email');
    await expect.element(input).toBeVisible();
    return input;
  }

  async function locatePassword() {
    const input = page.getByLabelText('Password');
    await expect.element(input).toBeVisible();
    return input;
  }

  async function locateSubmit() {
    const button = page.getByRole('button', { name: 'Log In' });
    await expect.element(button).toBeVisible();
    return button;
  }

  return { locateEmail, locatePassword, locateSubmit };
}
