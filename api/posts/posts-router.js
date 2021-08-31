// implement your posts router here
const express = require('express')
const Post = require('./posts-model')

const router = express.Router()

router.get('/', async (req,res)=>{
    
    Post.find()
    .then( found =>{
        res.status(200).json(found)
    })
    .catch(err=>{
        res.status(500).json({ message: "The posts information could not be retrieved" })
    })
})
router.get('/:id', async (req,res) =>{
    try{
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }else{
            res.status(200).json(post)
        }
    }catch(err){
        res.status(500).json({ message: "The post information could not be retrieved" })
    }
})
router.post('/', async (req,res)=>{
    const {title , contents}= req.body
    if(!title || !contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
        Post.insert({title,contents})
        .then(({id}) =>{
            return Post.findById(id)
            
        })
        .then(newPost =>{
            res.status(201).json(newPost)
        })
        .catch(err =>{
            res.status(500).json({ message: "There was an error while saving the post to the database" })
        })
    }
})
router.delete('/:id', async (req,res)=>{
    try{
        const delPost = await Post.findById(req.params.id)
        if(!delPost){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }else{
            const item = await Post.remove(req.params.id)
            res.json(delPost)
        }
    }catch(err){
        res.status(500).json({ message: "The post could not be removed" })
    }
})
router.put('/:id', (req,res)=>{
    const {title , contents}= req.body
    if(!title || !contents){
        res.status(400).json({ message: "Please provide title and contents for the post" })
    }else{
        Post.findById(req.params.id)
        .then(stuff =>{
         if(!stuff){
             res.status(404).json({ message: "The post with the specified ID does not exist" })
         } else{
             return Post.update(req.params.id, req.body)
         }
        })
        .then(data=>{
            if (data){
                return Post.findById(req.params.id)
            }
        })
        .then(post =>{
            if (post){
                res.json(post)
            }
        })
        .catch(err =>{
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
    }

})
router.get('/:id/comments', async (req,res)=>{
    try{
        const { id } = req.params
        const post = await Post.findById(id)
        if (!post){
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        }else{
            const messages = await Post.findPostComments(req.params.id)
            res.json(messages)
        }
    

    }catch(err){
        res.status(500).json({ message: "The post could not be removed" })
    }

})

module.exports = router;