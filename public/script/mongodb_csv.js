function JSONData(table_id) {
  this.content = {'column':{},'rows':{}};
  this.table_id = table_id;
  this.rowCount = $('#'+table_id+' tr').length;
}

JSONData.prototype.add = function(row,col) {
  var key = $('#'+this.table_id+' tr:eq('+row+') td:eq('+col+')').text();
  var colId = 'col'+col;
  if(!this.content.column[colId]) {
    this.content.column[colId] = key;
  }
  for(var r=row+1;r<this.rowCount;r++) {
    var rowId = 'row'+r;
    if(!this.content.rows[rowId]) {
      this.content.rows[rowId] = {}
    }
    var content = $('#'+this.table_id+' tr:eq('+r+') td:eq('+col+')').text();
    this.content.rows[rowId][colId]= content;
  }
};

JSONData.prototype.remove_column = function(colId) {
  if(!(colId in this.content.column)) return;
  delete this.content.column[colId];
  for(var rowId in this.content.rows) {
    delete this.content.rows[rowId][colId];
  }
};

JSONData.prototype.generate = function(callback) {
  for(var rowId in this.content.rows) {
    var row_content=[];
    var contains_info=false;
    for(var colId in this.content.column) {
      if(this.content.rows[rowId][colId].length) {
        if(this.content.rows[rowId][colId].length > 0) {
          contains_info=true;
        }
      }
      row_content.push({
        'name':this.content.column[colId], 
        'value':this.content.rows[rowId][colId] 
      });
    }
    if(contains_info) {
      callback(row_content);
    }
  }
};
 

function jsonTable(table_id,callback) {
  var jsonData = new JSONData(table_id);
  $('#'+table_id+' td').css('background','#ffffff');
  $('#'+table_id+' td').hover(function() {
    $(this).css('background', '#e0e0e0');
  },
  function() {
    $(this).css('background', '#ffffff');
  });
  $('#'+table_id+' td').click(function() {
    var col = $(this).parent().children().index($(this));
    var row = $(this).parent().parent().children().index($(this).parent());
    jsonData.add(row,col);
    callback(jsonData);
  });
}

