module.exports = function ( app ) {
    Array.prototype.unique = function() {
        var a = this.concat();
        for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
                }
        }
        return a;
    };
    var Content = require('../models/content.js');
    var content_types   =   ['Dev Tools', 'Data/SQL', 'IT Tools', 'Files',
                                'Branding & Templates', 'Hosting & Network', 'Creative Tools',
                                'Sales Tools', 'PM Tools', 'CM Tools', 'Reportings', 'Custom'];
    app.route('/').get(function (req, res)
    {
        Content.find({}, function(err, contents) {
          if (err) throw err;
          if(contents.length)
          {
              var content_types_tmp =   [];
              for (var key in contents){
                  if(contents[key].name.length)
                    content_types_tmp.push(contents[key].name);
              };

              content_types =   content_types.concat(content_types_tmp).unique();
          }
          var layout    =   contents.length ? 'index' : 'empty';

          data          =   {contents: contents, content_types: content_types};
          res.render(layout, data);
        });
    }).post(function(req, res)
    {
        Content.find({}, function(err, contents) {
            if (err) throw err;
            var id =   false;

            if(contents.length) {
                content =    contents.filter(function(v) {return v.name === req.body.content_type;});
                id      =    typeof content !== 'undefined' && typeof content[0] !== 'undefined'
                                ? content[0]._id : false;
            }
            if(id) {
                Content.findByIdAndUpdate(id,
                    {$push: {"websites": {name: req.body.website_name, address: req.body.website_addr}}},
                    {safe: true, upsert: true, new : true},
                    function(err, model) {
                        if(err)
                        {
                            res.status(500);
                            res.json({ msg: 'DB Error', 'error': err});
                        }
                        else
                            res.json({ msg: 'Successfully Created'});
                    }
                );
            }
            else {
                var newContent = Content({
                    name: req.body.content_type,
                    websites: [{
                        name: req.body.website_name,
                        address: req.body.website_addr
                    }]
                });
                newContent.save(function(err) {
                    if(err)
                    {
                        res.status(500);
                        res.json({ msg: 'DB Error', 'error': err});
                    }
                    else
                        res.json({ msg: 'Successfully Created'});
                });
            }
        });
    }).put(function(req, res)
    {
        var update = {};
        update['websites.' + req.body.index + '.name']      =   req.body.website_name;
        update['websites.' + req.body.index + '.address']   =   req.body.website_addr;

        Content.findByIdAndUpdate(req.body.id,
            {$set: update},
            {safe: true, upsert: true, new : true},
            function(err, model) {
                if(err)
                {
                    res.status(500);
                    res.json({ msg: 'DB Error', 'error': err});
                }
                else
                    res.json({ msg: 'Successfully Updated'});
        });
    }).delete(function(req, res)
    {
        var update = {};
        update['websites.' + req.body.index]      =   1;
        Content.findByIdAndUpdate(req.body.id, {$unset: update}, {safe: true, upsert: true, new : true},
        function(){
            Content.findByIdAndUpdate(req.body.id,
                {$pull: {"websites" : null}},
                function(err, model) {
                    if(err)
                    {
                        res.status(500);
                        res.json({ msg: 'DB Error', 'error': err});
                    }
                    else
                        res.json({ msg: 'Successfully Deleted'});
            });
        });
    });

    app.route('/clear').get(function (req, res) {
         Content.remove({}, function(){});
         res.send('DB Cleared');
    });
}
