var loginAPI = new XMLHttpRequest()
loginAPI.responseType = 'json';

loginAPI.addEventListener('load', () => {    
    console.log(loginAPI.response);
})

loginAPI.open('POST', "https://www.abibliadigital.com.br/api/users");
loginAPI.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
loginAPI.send('{"name": "Thiago Pereira Maia", "email": "tthiagopmaia@gmail.com", "password": "***REMOVED***", "notifications": true}');

    //Token:
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlR1ZSBPY3QgMDYgMjAyMCAwMzoxMDo1MCBHTVQrMDAwMC50dGhpYWdvcG1haWFAZ21haWwuY29tIiwiaWF0IjoxNjAxOTUzODUwfQ.J9CusTS1g3uJObw6Hb4da0K4ZmXZgeMKG8QUSH0E4sI

