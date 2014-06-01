
exports.uploadImageField = function(fieldName, oneField, imager, self, cb) {
  var field = self[fieldName];
  imager.upload(oneField, function (err, cdnUri, files) {
    if (err) return cb(err);
    if (files.length) {
      console.log("saving")
      field = { cdnUri : cdnUri, files : files }
      cb();
    }
  }, 'artwork');

}

exports.getNumberOfFieldsWithImages = function(fields) {
  var numberOfFieldsWithImages = 0;
  for (var field in fields) {
    if (fields[field][0].size > 0) {
      numberOfFieldsWithImages++;
    }
  }
  return numberOfFieldsWithImages;
}