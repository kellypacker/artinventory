module.exports = {
  variants: {
    artwork: {
      resize: {
        detail: "800x600"
      },
      crop: {
        thumb: "200x200"
      },
      resizeAndCrop: {
        mini: {resize: "200x150", crop: "100x100"}
      }
    },

    gallery: {
      crop: {
        thumb: "100x100"
      }
    }
  },

  storage: {
    S3: {
      key: '',
      secret: '',
      bucket: '',
      secure: false,
      style: 'path'
    },
    uploadDirectory: 'example/'
  },

  debug: true
}
