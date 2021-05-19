import {SVG} from './svg.min.js';

var primary = '#9370DB'
var darker = '#7659b3'
var darkest = '#5c458c'
var lighter = '#f2f2ff'
var lighter_dim = '#b9b9c7'
var lighter_darkest = '#8f8fb0'

var buttonColors = {'mouseover': darker, 'mouseout': primary, 'mousedown': darkest, 'mouseup': darker};
var uncheckedColors = {'mouseover': lighter_dim, 'mouseout': lighter, 'mousedown': darker, 'mouseup': lighter_dim};
var checkedColors = {'mouseover': darker, 'mouseout': primary, 'mousedown': lighter_dim, 'mouseup': lighter};
var scrollbarColors = {'mouseover': lighter_dim, 'mouseout': lighter_dim, 'mousedown': lighter_darkest, 'mouseup': lighter_dim};

var font_family = 'courier new';
// var size = "25%";

var MyToolkit = (function() {

    var Button = function(draw){
      var button = draw.group();
      var clickEvent = null;
      var stateEvent = null;
      var text = '';

      var rect = button.rect(100,50).fill({color: primary}).stroke({color: 'black'});
      button.css({cursor: 'pointer'});
     
      var buttonText = button.text('').fill({ color: lighter});
      buttonText.css({'pointer-events': 'none'});
      buttonText.x(rect.width()*0.20)
      buttonText.y(rect.height()*0.17)
      buttonText.font({family: font_family});
      buttonText.css({'user-select': 'none'});

      buttonActions(button, rect, buttonColors, transition);
      button.click(function(event){
        action(darker, 100, rect);
        if(clickEvent != null)
            clickEvent(event)
      });

      function transition(defaultState){
        if (stateEvent != null)
          stateEvent(defaultState);
      }
      
      return { // public functions
        setText: function(text){
          buttonText.text(text)
        },
        move: function(x, y) {
          button.move(x, y);
        },
        stateChanged: function(eventHandler){
          stateEvent = eventHandler 
        },
        onclick: function(eventHandler){
          clickEvent = eventHandler
        },
        setId: function(id){
          checkbox.attr('id', id);
        }
      }
    }

    var ToggleBox = function(shape, draw){
      var togglebox = draw.group();
      var object = null;
      var colors = uncheckedColors;

      if (shape === 'rectangle'){
        object = togglebox.rect(20,20).fill(lighter).stroke({color: 'black'});
      }
      else{
        object = togglebox.circle(20).fill(lighter).stroke({color: 'black'});
      }

      var check = false;
      var state = 'idle'
      var stateEvent = null;
      var checkedEvent = null;
      var toggleboxText = togglebox.text('').fill({ color: 'black'});
      toggleboxText.font({family: font_family});
      toggleboxText.css({'pointer-events': 'none'});
      toggleboxText.css({'user-select': 'none'});
      

      object.css({cursor: 'pointer'});

      object.mousedown(function(){
        state = 'pressed';
        transition(state);
      });
      object.mouseover(function(){
        state = 'hover';
        transition(state);
      });
      object.mouseout(function(){
        state = 'idle';
        transition(state);
      });
      object.mouseup(function(){
        state = 'up';
        transition(state);
      });
      object.click(function(event){
        if(checkedEvent != null)
          checkedEvent(event);
        if (check){
          check = false;
          action(lighter, 150, object);
          colors = checkedColors;
        }
        else{
          check = true;
          action(primary, 150, object);
          colors = uncheckedColors;
        }
      });

      function transition(defaultState){
        if (stateEvent != null)
          stateEvent(defaultState);
      }

      return {
        move: function(x, y) {
          togglebox.move(x, y);
        },
        setText: function(text) {
          toggleboxText.text(text);
          toggleboxText.move(object.x() + 30, object.y()); 
        },
        stateChanged: function(eventHandler){
          stateEvent = eventHandler;
        },
        oncheck: function(eventHandler){
          checkedEvent = eventHandler;
        }, 
        setId: function(id){
          togglebox.attr('id', id);
        },
        src: function(){
          return togglebox;
        },
        object: function(){
          return object;
        }
      }
    }

    var CheckBox = function(draw){
      // var draw = SVG().addTo('body');
      var checkbox = new ToggleBox('rectangle', draw);
      return {
        move: function(x, y) {
          checkbox.move(x, y)
        },
        setText: function(text) {
          checkbox.setText(text)
        },
        stateChanged: function(eventHandler){
          checkbox.stateChanged(eventHandler);
        },
        oncheck: function(eventHandler){
          checkbox.oncheck(eventHandler);
        }, 
        setId: function(id){
          checkbox.setId(id)
        },
        src: function(){
          return checkbox.src();
        }
      }
    }

    var RadioDial = function(draw){
      var radioDial = new ToggleBox('circle', draw);
      var checkEvent = null;

      // when clicked on dial show which dial (by id)
      var dial = radioDial.src();
      radioDial.src().click(function(event){
        if (checkEvent != null){
          checkEvent(event, dial.attr('id'));
        }
      });

      return {
        move: function(x, y) {
          radioDial.move(x, y)
        },
        setText: function(text) {
          radioDial.setText(text);
        },
        stateChanged: function(eventHandler){
          radioDial.stateChanged(eventHandler);
        },
        oncheck: function(eventHandler){
          // radioDial.oncheck(eventHandler);
          checkEvent = eventHandler;
        }, 
        setId: function(id){
          radioDial.setId(id)
        },
        src: function(){
          return radioDial.src();
        },
        getId: function(){
          return radioDial.src().attr('id');
        },
        object: function(){
          return radioDial.object();
        }
      }
    }

    var RadioDials = function(draw, n){
      // n - number of radio dials
      var y = 0;
      var radioDialsList = []; 

      for (var i=0; i<n; i++){
        var radioDial = new RadioDial(draw);
      
        radioDial.setId(i);  
        radioDial.move(0, y);
        radioDialsList.push(radioDial);
        y += 30;
      }

      radioDialsList.forEach(dial=> {
        dial.src().click(function(event){
          var id = dial.getId();
          action(primary, 150, dial.object())
          for (var j=0; j<n; j++){
            if (j!=id){
              action(lighter, 150, radioDialsList[j].object())
            }
          }
        });
      });

      return {
        move: function(x, y) {
          for (var i=0; i<radioDialsList.length; i++){
            var radioY = radioDialsList[i].src().y();
            // var radioX = radioDialsList[i].src().x();
            radioDialsList[i].move(x, y+ radioY);
          }
        },
        setText: function(position, text) {
          radioDialsList[position].setText(text);
        },
        stateChanged: function(eventHandler){
          for (var i=0; i<radioDialsList.length; i++){
            radioDialsList[i].stateChanged(eventHandler);
          }
        },
        oncheck: function(eventHandler){
          for (var i=0; i<radioDialsList.length; i++){
            radioDialsList[i].oncheck(eventHandler);
          }
        }, 
        // setId: function(id){
        //   checkbox.setId(id)
        // }
      }
    }

    var TextBox = function(draw){
      var textbox = draw.group();
      var textInput = "";
      var textChangeEvent = null;
      var rect = textbox.rect(200, 30).fill('white').stroke("black")
      
      var text = textbox.text(textInput);
      text.font({family: font_family});
      text.x(text.x()+ 3)
      var defaultState = 'idle';
      var stateEvent = null;
      
      
      var caret = textbox.line(3, 2.5, 3, 25).stroke({ width: 1, color: 'black' })
      // if (x < rect.width()){
      //   caret = textbox.line(x, 2.5, x, 25).stroke({ width: 1, color: "black" })
      // }
      // else{
      //   caret = textbox.line(rect.width(), 2.5, rect.width(), 25).stroke({ width: 1, color: "black" })
      // }

      caret.back();
      document.addEventListener("keydown", function(event) {
          if (defaultState == 'hover'){
            
            if (event.key == 'Backspace'){  
              if (textInput.length > 0){
                textInput = textInput.slice(0, -1);
                text.text(textInput)
                textchange(event.key)
              }          
            }
            else if (event.key == 'Shift'){

            }
            else{
              textInput = textInput + event.key;
              text.text(textInput)
              textchange(event.key)
            }
            
            var x = text.x() + text.length() + 2;
            caret.move(x, textbox.y() + 2.5)
            if (x <= textbox.x()){
              caret.x(rect.x()+ 3)
            }
            else{
              caret.show()
            }
            
          }
      });
      
      textbox.mouseover(function(e){
        caret.front();
        defaultState = 'hover';
        transition(defaultState);

      });
      textbox.mouseout(function(){
        caret.back();
        defaultState = 'idle';
        transition(defaultState);
      });

      function transition(defaultState){
        if (stateEvent != null)
          stateEvent(defaultState);
      }

      function textchange(keypress){
        if (textChangeEvent != null){
          textChangeEvent(keypress);
        }
      }
      
      return {
          move: function(x, y) {
              textbox.move(x, y);
          },
          src: function(){
              return textbox;
          },
          stateChanged: function(eventHandler){
            stateEvent = eventHandler;
          },
          textChanged: function(eventHandler){
            textChangeEvent = eventHandler;
          },
          getText: function(){
            return textInput;
          }
      }
    }

    var ProgressBar = function(draw){
      var progressBar = draw.group();
      var barWidth = 100.0;
      var progressNumber = 0;
      var bar = null;
      var progressChangedEvent  = null;

      var bar = progressBar.rect(barWidth,15).fill({color: lighter}).stroke({color: 'black'});
      var progress = progressBar.rect(progressNumber,15).fill({color: primary}).stroke({color: 'black'});

      return {
        setWidth: function(width){
          barWidth = width
          bar.width(width)
        },
        incrementProgress: function(){
          if (progressNumber < barWidth)
            progressNumber += 1;
          progress.width(progressNumber);

          if (progressChangedEvent != null){
            progressChangedEvent(progressNumber);
          }
        },
        setProgress: function(number){
          progressNumber =  barWidth * (number/100.0);
          progress.width(progressNumber);
        },
        getProgress: function(){
          return (progressNumber/barWidth)*100;
        },
        move: function(x, y){
          progressBar.move(x, y)
        },
        stateChanged: function(eventHandler){

        },
        progressIncremented: function(eventHandler){
          progressChangedEvent = eventHandler;
        }
      }

    }

    var ScrollBar = function(draw){
      var scrollbar = draw.group();
      var barHeight = 300;
      var colors = scrollbarColors;
      var defaultState = 'idle';
      var stateEvent = null;
      var barMovedEvent = null;

      var bar = scrollbar.rect(17, barHeight).fill({color: lighter}).stroke({color: 'black'});
      var thumb = scrollbar.rect(17, 50).fill({color: lighter_dim}).stroke({color: 'black'});

      // states tracked in window
      draw.mouseup(function(){
        if (defaultState == 'pressed-thumb'){
          action(colors.mouseup, 10, thumb);
          defaultState = "up";
          transition(defaultState)
        }
        // else{
        //   action(colors.mouseup, 10, thumb);
        //   transition('up')
        // }
      });
      draw.mousemove(function(event){

        if (defaultState == 'pressed-thumb'){
          var direction = event.movementY;

          if (direction > 0){
            if (thumb.y()+1 <= scrollbar.y()+scrollbar.height()-thumb.height()){
              thumb.y(thumb.y()+1);
              barState('down')
            }
          }
          else{
            if (thumb.y()-1 >= scrollbar.y()){
              thumb.y(thumb.y()-1);
              barState('up')
            }
          }
        }
      });
      draw.mousedown(function(event){
        var x = event.offsetX;
        var y = event.offsetY;

        var minX = thumb.x();
        var maxX = thumb.x()+thumb.width();

        var minY = thumb.y();
        var maxY = thumb.y()+thumb.height();
        // console.log(minX, x, maxX)
        // console.log(minY, y, maxY)
        // console.log(event)
        if (((minX <= x) && (x <= maxX)) && ((minY <= y) && (y <= maxY)))   // make sure you click the thumb of the scroll bar
        {
          // console.log(minX, clientX, maxX)
          action(colors.mousedown, 10, thumb);
          defaultState = 'pressed-thumb';
          transition(defaultState);
        }

      })

      // thumb states
      thumb.mouseover(function(){
        // action(colors.mouseover, 100, thumb);
        defaultState = 'hover-thumb';
        transition(defaultState);
      })
      thumb.mouseout(function(){
        if (defaultState != 'pressed-thumb'){
          defaultState = 'idle';
          action(colors.mouseout, 10, thumb);
          transition(defaultState);
        }
      })

      // bar states
      bar.mouseover(function(){
        transition('hover-bar');
      });
      bar.mouseout(function(){
        transition('idle');
      })

      function transition(defaultState){
        if (stateEvent != null)
          stateEvent(defaultState);
      }
      function barState(direction){
        if (barMovedEvent != null){
          barMovedEvent(direction);
        }
      }
      return {
        move: function(x,y){
          scrollbar.move(x, y);
        },
        stateChanged: function(eventHandler){
          stateEvent = eventHandler;
        },
        setHeight: function(height){
          barHeight = height;
          bar.height(height);
        },
        getThumbPosition: function(){
          return [thumb.x(), thumb.y()];
        },
        barMoved: function(eventHandler){
          barMovedEvent = eventHandler;
        }
      }
    }

    var Slider = function(draw){
      var slider = draw.group();
      var sliderWidth = 300.0;
      var colors = scrollbarColors;
      var defaultState = 'idle';
      var stateEvent = null;
      var barMovedEvent = null;
      var percentNumber = 0;

      var bar = slider.rect(sliderWidth, 4).fill({color: lighter}).stroke({color: 'black'});
      var thumb = slider.rect(5, 17).fill({color: lighter_dim}).stroke({color: 'black'});
      thumb.move(0, thumb.y() - 5);

      var percent = slider.text(String(percentNumber)).fill({ color: 'black'});
      percent.font({family: font_family});
      percent.css({'pointer-events': 'none'});
      percent.css({'user-select': 'none'});
      percent.move(0, 20)


      // states tracked in window
      draw.mouseup(function(){
        if (defaultState == 'pressed-thumb'){
          // action(colors.mouseup, 0, thumb);
          defaultState = "up";
          transition(defaultState)
        }
        // else{
        //   action(colors.mouseup, 10, thumb);
        //   transition('up')
        // }
      });
      draw.mousemove(function(event){
        if (defaultState == 'pressed-thumb'){
          var direction = event.movementX;
          var pointerX = event.offsetX - thumb.x();
          // console.log(event)
          if (direction > 0){
            // var movePointer = thumb.x()+pointerX;
            if (thumb.x()+1 <= slider.x()+slider.width()-thumb.width()){
              // thumb.x(movePointer);
              thumb.x(thumb.x()+1)
              barState('right');
              percent.text(String(Math.ceil((++percentNumber/sliderWidth*100)+1)))
            }
          }
          else{
            if (thumb.x()-1 >= slider.x()){
              thumb.x(thumb.x()-1);
              barState('left')
              percent.text(String(Math.round(--percentNumber/sliderWidth*100)))
            }
          }
        }
      });
      draw.mousedown(function(event){
        var x = event.offsetX;
        var y = event.offsetY;

        var minX = thumb.x();
        var maxX = thumb.x()+thumb.width();

        var minY = thumb.y();
        var maxY = thumb.y()+thumb.height();
        // console.log(minX, x, maxX)
        // console.log(minY, y, maxY)
        // console.log(event)
        if (((minX <= x) && (x <= maxX)) && ((minY <= y) && (y <= maxY)))   // make sure you click the thumb of the scroll bar
        {
          // action(colors.mousedown, 0, thumb);
          defaultState = 'pressed-thumb';
          transition(defaultState);
        }

      })

      // thumb states
      thumb.mouseover(function(){
        // action(colors.mouseover, 100, thumb);
        defaultState = 'hover-thumb';
        transition(defaultState);
      })
      // thumb.mouseout(function(){
      //   if (defaultState != 'pressed-thumb'){
      //     defaultState = 'idle';
      //     // action(colors.mouseout, 0, thumb);
      //     transition(defaultState);
      //   }
      // })

      // bar states
      bar.mouseover(function(){
        transition('hover-bar');
      });
      bar.mouseout(function(){
        transition('idle');
      })

      function transition(defaultState){
        if (stateEvent != null)
          stateEvent(defaultState);
      }
      function barState(direction){
        if (barMovedEvent != null){
          barMovedEvent(direction);
        }
      }
      return {
        move: function(x,y){
          slider.move(x, y);
        },
        // stateChanged: function(eventHandler){
        //   stateEvent = eventHandler;
        // },
        // setWidth: function(width){
        //   sliderWidth  = width;
        //   bar.width(width);
        // },
        getThumbPosition: function(){
          return [thumb.x(), thumb.y()];
        },
        // barMoved: function(eventHandler){
        //   barMovedEvent = eventHandler;
        // }
      }
    }


return {Button, ToggleBox, CheckBox, RadioDials, RadioDial, TextBox, ProgressBar, ScrollBar, Slider}
}());

export{MyToolkit}

function action(color, duration, object){
  object.animate(duration, 0, 'now').attr({fill: color})
}

function buttonActions(object, parentObject, colors, transition){
  var defaultState = 'idle';

  object.mouseup(function(){
    action(colors.mouseup, 100, parentObject);
    defaultState = "up";
    transition(defaultState)
  })
  object.mouseover(function(){
    action(colors.mouseover, 100, parentObject);
    defaultState = 'hover';
    transition(defaultState);
  })
  object.mouseout(function(){
    action(colors.mouseout, 100, parentObject);
    defaultState = 'idle';
    transition(defaultState);
  })
  object.mousedown(function(){
    action(colors.mousedown, 100, parentObject);
    defaultState = 'pressed';
    transition(defaultState);
  })
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}