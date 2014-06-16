var socket = io.connect();
function addMessage(msg, pseudo) {
      var elem = $('#chatEntries');
      var atBottom = (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight());
      $("#chatEntries").append('<div class="message" style="text-align:left" ><p>' + pseudo + ' : ' + msg + '</p></div>');
      if (atBottom)
       $('#chatEntries').scrollTop($('#chatEntries')[0].scrollHeight);
}
function addMyMessage(msg, pseudo) {
      var elem = $('#chatEntries');
      var atBottom = (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight());
      $("#chatEntries").append('<div class="message" style="text-align:right"><p>' + pseudo + ' : ' + msg + '</p></div>');
      if (atBottom)
       $('#chatEntries').scrollTop($('#chatEntries')[0].scrollHeight);
}



function sentMessage() {
   if ($('#messageInput').val() != "") 
   {
      socket.emit('message', $('#messageInput').val());
      addMyMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
      $('#messageInput').val('');
   }
}
function setPseudo() {
  // if ($("#pseudoInput").val() != "")
   //{
      console.log("Hello");
      socket.emit('pageLoaded', 'pageLoaded');
      $('#chatControls').show();
   //  $('#pseudoInput').hide();
   //  $('#pseudoSet').hide();
   //}
}

function setValue(id)
{

   if($("#valueInput"+ id+"").val() != "")
   {
      console.log($("#valueInput"+ id +"").val());
      socket.emit('valueData', {'value':$("#valueInput"+ id +"").val(), 'id':id});
      $("#valueInput"+ id +"").hide();
      $("#bid"+ id +"").hide();
   }
}
function addCard(id, name, specs, image)
{
   console.log(id);
   console.log(specs);
   var div = document.getElementById('#card');
  
   
   div.innerHTML = div.innerHTML + "<div class='col-6 col-sm-6 col-lg-4' style='width:250px; float:left;text-align:center; background-color: #9FC8E0; border-style:outset;margin:20px'><img class='img-circle' style='width:150px;height:150px;margin-top:20px;' src='images/"+ image +"' data-src='holder.js/140x140' alt='Card'>  <h2>"+ name +"</h2><p>"+ specs +"</p>"+"<p><input id = 'valueInput"+id+"' type='number' /><button id ='bid"+id+"' onclick='setValue("+ id +")' >Bid</button></p></div>";
}



socket.on('row', function(row)
{

   addCard(row['id'], row['name'], row['specs'], row['image']);
});
socket.on('message', function(data) {
   addMessage(data['message'], data['pseudo']);
});
socket.on('xp', function(data){
  console.log(data);
  document.getElementById("xp").innerHTML = "<a href= '#'>"+ data+"</a>";
});
/* attempt to receive an array object from server
socket.on('goods', function(goods)
{
   for(var i= 0; i<goods.length;i++){
      console.log(goods['goodsNames'][i]);
      console.log(goods['goodsDescriptions'][i]);
    document.getElementById("col-6 col-sm-6 col-lg-4").innerHTML = "<h2>"+goods['goodsNames'][i]+'</h2><p>'+goods['goodsDescriptions'][i]+'</p> <p><a class="btn btn-default" href="#">View details &raquo;</a></p>';
   }
});

*/


/*
function generateCards(){
   $("col-6 col-sm-6 col-lg-4").append('<h2>'+db.query("SELECT name FROM users WHERE id = 1")+'</h2><p>'+db.query("SELECT name FROM users WHERE id = 1")+'</p>');
   console.log("db.query("SELECT name FROM users WHERE id = 1")");
}
*/
   


$(function() {
//  $("#chatControls").hide();
// $("#pseudoSet").click(function() {setPseudo();});
  setPseudo();
   $("#submit").click(function() {sentMessage();});
});

