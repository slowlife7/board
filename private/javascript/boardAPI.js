module.exports = function(model) {
  return {
    getPageData(json) {
      return new Promise(function(resolve, reject) {
        let count_items = 0;
        model
          .countDocuments(json.condition)
          .then(count => {
            count_items = count;
            return model
              .find(json.condition, { _id: 0, __v: 0 })
              .sort(json.sort)
              .skip(json.skip)
              .limit(parseInt(json.limit));
          })
          .then(result => {
            resolve({ count_items: count_items, items: result });
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  };
};
