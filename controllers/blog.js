const Blog = require('../model/blog');

exports.create = (req, res) => {
    const { imageUrl, title, body } = req.body;
    console.log('Create message', title, body);

    // // posted by user
    const authUserId = req.user.id;

    // Create blog
    Blog.findOne({ where: { title: title}}).then((blog) => {
        if(!blog) {
            Blog.create({ imageUrl, title, body, userId: authUserId }).then((result) => {
                console.log('Blog created', result);
                res.json({
                    message: 'Blog successfully created.',
                    result
                })
            }).catch((err) => {
                console.log('Blog create error', err);
                res.status(400).json({
                    error: 'Blog could not be added to db. Try again later.'
                })
            })
        } else {
            res.status(400).json({
                error: 'Blog title already exists in database. Try renaming it.'
            })
        }
    }).catch((err) => {
        console.log(err);
        res.status(400).json({
          error: "Error with the database. Please try again later.",
        });
      });
    
}

exports.list = (req, res) => {
    Blog.findAll().then((data) => {
        console.log(data);
        res.json(data);
    }).catch((err) => {
        console.log(err);
        res.status(400).json({
            error: 'Could not retreive blogs from database.'
        })
    })
}

exports.read = (req, res) => {
    const {id} = req.params;
    Blog.findAll({ where: { id: id}}).then((result) => {
        console.log(result);
        res.json(result);
    }).catch((err) => {
        console.log('Blog search by id err', err);
        res.status(400).json({
            error: 'Error retreiving blog from database.'
        })
    })
}

exports.update = (req, res) => {
    const {id} = req.params;
    const {imageUrl, title, body} = req.body;

    Blog.update({ imageUrl, title, body }, { where: {id: id}}).then((edited) => {
        res.json({
            message: 'Blog successfully edited',
            edited
        })
    }).catch((err) => {
        console.log('Blog update err', err);
        res.status(400).json({
            error: 'Error updating the blog. Try again.'
        })
    })
}

exports.remove = (req, res) => {
    const {id} = req.params;
    Blog.destroy({ where: {id: id}}).then((destroyed) => {
        console.log(destroyed);
        res.json({
            message: 'Blog successfully deleted'
        })
    }).catch((err) => {
        console.log(err);
        res.status(400).json({
            error: 'Error deleting your blog. Try again later.'
        })
    })
}