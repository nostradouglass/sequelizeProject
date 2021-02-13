const express = require('express')

const { sequelize, User, Post } = require('./models')

const app = express()

app.use(express.json())

// Create new User
app.post('/users', async(req, res) => {
    const { name, email, role  } = req.body
    try {
        const user = await User.create({ name, email, role})
        return res.json(user)
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
})

// Get All users
app.get('/users', async(req, res) => {
    try {
        const users = await User.findAll()

        return res.json(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: "something went wrong"} )
    }
})

// Get single User
app.get('/users/:uuid', async(req, res) => {
    const uuid = req.params.uuid
    try {
        const user = await User.findOne({
            where : { uuid: uuid},
            include: 'posts'
        })

        return res.json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: "something went wrong"} )
    }
})

// Create a post
app.post('/posts', async(req, res) => {
    const { userUuid, body} = req.body
    try { 
        const user = await User.findOne({ where: { uuid: userUuid }})
        const post = await Post.create({body, userId: user.id })
        return res.json(post)
    } catch(err) {
        console.log(err)
        return res.status(500).json(err)
    }
})


app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.findAll({ include: ['user']})

        return res.json(posts)
    } catch {
        console.log(err)
        res.status(500).json({ err: "something went getting all posts"} )
    }
})


app.listen({ port: 5000}, async () => {
    console.log("Server running on localhost:5000")
    await sequelize.authenticate()
    console.log("database Connected")
})
