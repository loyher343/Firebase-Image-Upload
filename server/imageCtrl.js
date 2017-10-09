
  const uploadImages = (req, res) => {
    console.log(req.body)
    req.app
      .get('db')
      .upload_pic(req.body)
  }

  module.exports = {
  	uploadImages
  }
