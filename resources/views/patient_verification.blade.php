<!DOCTYPE html>
<html lang="en">


<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>


<body>
    <h2>Verify Your Email Address</h2>
    <p>Dear {{ $patient->user_name }},</p>
    <p>Thank you for signing up as a user in our website. To complete your registration, please verify your email
        address by
        clicking the button below:</p>

    <table role="presentation" align="center" cellspacing="0" cellpadding="0" border="0">
        <tr>
            <td align="center">
                <a href="{{ route('verify.email.user', ['token' => $patient->verification_token]) }}"
                    style="padding: 10px 20px; background-image: linear-gradient(140deg, #b9f7eb8c 20%, #87bed28c 60%);color: #0d4155; text-decoration: none; border-radius: 10px;    font-size: max(2.3vmin, 8px); display: inline-block;">Verify
                    Email Address</a>
            </td>
        </tr>
    </table>

    <p>If you did not sign up for an account, please ignore this email.</p>
    <p>Thank you,</p>
    <p>Sandra Team</p>
</body>


</html>