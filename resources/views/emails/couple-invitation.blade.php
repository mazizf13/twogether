<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body style="font-family: Arial, sans-serif; background-color: #fce7f3; margin: 0; padding: 40px 20px; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; padding: 40px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <h1 style="color: #ec4899; font-size: 24px; margin-bottom: 20px;">Twogether</h1>
        
        <h2 style="color: #1c1917; font-size: 20px; margin-bottom: 24px;">
            {{ $inviter->display_name }} wants to plan your wedding together 💍
        </h2>
        
        <p style="color: #57534e; font-size: 16px; margin-bottom: 32px;">
            You've been invited to join a Couple Space on Twogether. Start tracking your budget, sharing tasks, and preparing for your big day together.
        </p>
        
        <a href="{{ url('/invite/' . $invitation->token) }}" style="display: inline-block; background-color: #ec4899; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 16px; margin-bottom: 32px;">
            Accept Invitation & Join
        </a>
        
        <p style="color: #a8a29e; font-size: 14px;">
            This invitation expires in 72 hours.
        </p>
    </div>
</body>
</html>
