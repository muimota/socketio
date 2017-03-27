
$(document).ready(init)
var socket
var cells
function init(){
  socket = io('/panel')

  cells = []
  for(var i=0;i<15;i++){
    //select every cell
    var cell = $('#c'+i)
    cells.push(cell)
  }
  displayBits([0,1,0,1,0,1,1,1,1,1,0,1,1,0,1])

  //display how many devices are associated to each pixel
  socket.on('connCount',function(connCount){
    for(var i=0;i<15;i++){
      if(connCount[i] > 0){
        cells[i].addClass('connected')
      }else{
        cells[i].removeClass('connected')
      }
    }
  })

  $('table.table td').click(function(){
    $(this).toggleClass('selected')
    var code = updateCode()
    $('#code').text(code.join(''))
    socket.emit('pixels',code)
  })
}
//display the code of the character display
function updateCode(){
  var code = []
  for(var i=0;i<cells.length;i++){
    var cell = cells[i]
    var bit  = cell.hasClass('selected')
    //http://stackoverflow.com/questions/7820683/convert-boolean-result-into-number-integer#7820695
    code.push(bit + false)
  }
  return code
}

function displayBits(bits){
  var code = ''
  for(var i=0;i<bits.length;i++){
    var cell = cells[i]
    var bit  = bits[i]
    if(bit){
      cell.addClass('selected')
    }else{
      cell.removeClass('selected')
    }
    code += bit
  }
  $('#code').text(code)
}

//
function phoneHandler(event){
  var bg
  var connid = $(this).data('connid')
  if($(this).hasClass('active')){
    bg = 'black'
  }else{
    bg = 'white'
  }
  socket.emit('bg',{'bg':bg,'connid':connid})

}
