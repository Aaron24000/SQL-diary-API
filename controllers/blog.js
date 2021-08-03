const Blog = require('../model/blog');

exports.create = (req, res) => {
    const { title, body } = req.body;
    console.log('Create message', title, body);

    // // posted by user
    const authUserId = req.user.id;

    // Create blog
    Blog.findOne({ where: { title: title}}).then((blog) => {
        if(!blog) {
            Blog.create({ title, body, userId: authUserId }).then((result) => {
                console.log('Blog created', result);
                res.json({
                    message: 'Blog successfully created.'
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