# DaisiApp
Whatsapp Profile subscription with nodeJs and mongoDB 

# how to start ?
- Make sure mongoo DB installed on your local
- Change mongoo connection on app.js (mongoo connection's section)
- install all modules by :
```
npm install
```

- then to start :
```
npm start
```

- Sample input for route POST '/profile/{token}'
```
{
  "phone": "09871234",
  "email": "bima@mail.com",
  "sender": "bima",
  "message" : "Hi IES! Please send this message to activate the reminder for Sunday Service at 11:15 AM."
}
```

Another available keywords:
- Hi IES! Please send this message to activate the reminder for Saturday Service at 05:00 PM.
- Hi IES! Please send this message to activate the reminder for our Facebook Live Saturday Service at 07:00 PM.
- Hi IES! Please send this message to activate the reminder for Sunday Service at 09:30 AM.
- Hi IES! Please send this message to activate the reminder for Sunday Service at 11:15 AM.
- Hi IES! Please send this message to activate the reminder for our YouTube Premiere on Sunday at 01:00 PM.

