const express = require('express')
const mysql = require('mysql');

const port = 3000

const app = express()
app.use(express.urlencoded());

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

con.connect(function (err) {
    if (err) throw err
    console.log("connected to DB!")
});

function getNames() {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM people`, (err, result) => {
            if (err) return reject(err)
            resolve(result)
        })
    })
}

app.get('/', (req, res) => {
    res.send(`<title>Home</title>
<h1>Full Cycle Rocks! =D</h1>
<a href='/register'>Register Name</a>
<br><a href='/list'>List Names</a>
`)
})

app.get('/list', async (req, res) => {
    const rows = await getNames()
    let list = '<ul>'
    rows.forEach(row => {
        list += `<li>${row.name}</li>`
    })
    list += '</ul>'
    const header = rows.length === 1 ? `${rows.length} Name in the DB:` : `${rows.length} Names in the DB:`
    res.send(`<title>List</title>
<a href='/'>Home</a>
<a href='/register'>Register Name</a>
<h3>${header}</h3>
${list}
`)
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

app.post('/register', (req, res) => {
    const name = req.body.name
    console.log(`received name: ${name}`)

    con.query(`INSERT INTO people(name) VALUES('${name}')`, function (err, result) {
        if (err) throw err
        console.log(`name ${name} inserted successfully!`)
    });

    res.send(`Registered ${name} successfully! Now go choose where to go:
<br><a href='/'>Home</a>
<br><a href='/register'>Register Name</a>
<br><a href='/list'>List Names</a>
`)
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
