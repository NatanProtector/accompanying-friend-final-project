# Email Templates

This folder contains HTML email templates used by the Accompanying Friend application for sending automated emails to users.

## Overview

These templates are designed to be used with the **EmailJS dashboard** service. They provide a consistent and professional appearance for all automated emails sent by the application.

## EmailJS Setup

We use **two separate EmailJS accounts** to manage our email templates efficiently and avoid paying for multiple templates on a single account. This setup allows us to organize templates across different accounts while maintaining cost-effectiveness.

**EmailJS Service:** [https://www.emailjs.com/](https://www.emailjs.com/)

## Available Templates

- **`welcome.html`** - Welcome email for new user registrations
- **`verify_email.html`** - Email verification for new accounts
- **`password-reset.html`** - Password reset functionality

## Template Variables

All templates use **EmailJS template variables** that are surrounded by double curly braces: `{{variable_name}}`

### Common Variables Used:

- `{{name}}` - User's display name
- `{{reset_link}}` - Password reset URL
- `{{verification_link}}` - Email verification URL
- `{{email}}` - User's email address

### How Variables Work:

1. Variables are replaced with actual data when the email is sent
2. The format `{{keyword}}` tells EmailJS to substitute the keyword with the corresponding value
3. Variables are case-sensitive and must match exactly in both the template and the sending code

## Template Structure

Each template includes:

- **Bilingual support** (Hebrew and English)
- **Responsive design** for mobile and desktop
- **Professional styling** with consistent branding
- **Clear call-to-action buttons**

## Usage

To use these templates:

1. Upload the HTML files to your EmailJS dashboard
2. Configure the template variables in your EmailJS service
3. Reference the template ID when sending emails from your application

## Styling

Templates use inline CSS for maximum email client compatibility. The design follows a clean, modern aesthetic with:

- System fonts for better rendering
- Responsive layout (max-width: 600px)
- Professional color scheme
- Clear typography hierarchy
