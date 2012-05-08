function SmisView(smis_provider) {
  this.smis_provider = smis_provider;
  this.basepath = '/node';
};

SmisView.prototype = {
  showItems: function(req, res) {
    var self = this;
    this.getItems(function(error, collections) {
      if(error) {
        console.log('Error :'+error);
      }
      if(!collections) {
        collections = [];
      }
      self.showResults(res, collections);
    });
  },
  getItems: function(callback) {
    this.smis_provider.findAll(callback);
  },
  showResults: function(res, collections) {
    res.render('smis/list', {collections:collections,baseurl:this.basepath});
  },
};


exports.SmisView = SmisView;
