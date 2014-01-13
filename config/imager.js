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
      key: 'AKIAJGRRCEMUOFUXOHYQ',
      secret: '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',
      bucket: 'kellypackercom',
      region: 'REGION'
    }
  },

  debug: true
}
