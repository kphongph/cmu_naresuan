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
  getItem: function(req,res) {
    var self = this;
    this.smis_provider.findById(req.params.id,function(error, smis) {
      if(smis.row_id) {
        self.smis_provider.findByRowId(smis.row_id,function(err, related_smis) {
          res.render('smis/detail',{baseurl:self.basepath, smis:smis, row_data:related_smis});
        });
      } else {
        res.render('smis/detail',{baseurl:self.basepath, smis:smis});
      }
    });
  },
  getItemsByRowId: function(req, res) {
    this.smis_provider.findByRowIdStr(req.params.id,function(err, docs) {
      res.contentType('json');
      if(err) {
        console.log(err);
        res.send([]);
      } else {
        res.send(docs);
      }
    });
  },
  showResults: function(res, collections) {
    res.render('smis/list', {collections:collections,baseurl:this.basepath});
  },
  search: function(req,res) {
    res.render('smis/search', {baseurl:this.basepath, layout:false});
  },
  searchWithField: function(req, res) {
    var field_name = req.body.field;
    var field_value = req.body.value;
    // console.log('+searchWithField '+field_name+' '+field_value);
    this.smis_provider.filter({
      'name':field_name,'value':{$regex:field_value}},function(err, docs) {
      res.contentType('json');
      if(err) {
        console.log(err);
        res.send([]);
      } else {
        res.send(docs);
      }
    });
  },
  listSearchFields: function(req,res) {
    this.smis_provider.findAll(function(err, docs) {
      res.contentType('json');
      if(err) {
        res.send('{"status":"error", "message":"'+err+'"}');
      } else {
        var dict = {};
        var key_list = [];
        for(var i=0;i<docs.length;i++) {
          var doc=docs[i];
          if(doc.name) {
            if(!(doc.name in dict)) {
              dict[doc.name]='added';
              key_list.push(doc.name);
            }
          }
        }
        var context = {'status':'ok', 'contents':key_list};
        res.send(context);
      }
    });
  }
};


exports.SmisView = SmisView;
