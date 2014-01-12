module.exports = {
  variants: {
    artworks: {
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
      key: 'API_KEY',
      secret: 'SECRET',
      bucket: 'BUCKET_NAME',
      region: 'REGION'
    }
  },

  debug: true
}
