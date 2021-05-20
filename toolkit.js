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

/**
 * To create a widget: 
 *    ex: var button = new MyToolKit.Button(draw)
 * @param  {function} 
 */
var MyToolkit = (function() {
    
  /**
   * 
   * @name Button
   * @class
   * @param  {Object} draw - svg draw object
   */
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

      return { 
        /**
         * sets button's label to text
         * @memberof Button
         * @param  {String} text
         */
        setText: function(text){
          buttonText.text(text)
        },
        /**
         * moves button to location (x,y)
         * @memberof Button
         * @param  {Number} x
         * @param  {Number} y
         */
        move: function(x, y) {
          button.move(x, y);
        },
        /**
         * specifies function to be run when button changes state, event is current state (hover, idle, pressed, up)
         * @memberof Button
         * @param  {function} eventHandler
         */
        stateChanged: function(eventHandler){
          stateEvent = eventHandler 
        },
        /**
         * specifies function to be run when button is clicked, event is MouseEvent
         * @memberof Button
         * @param  {function} eventHandler
         */
        onclick: function(eventHandler){
          clickEvent = eventHandler
        }
      }
    }

    /**
     * @param  {Object} draw - svg draw object
     */
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

    /**
     * @name CheckBox
     * @class
     * @param  {Object} draw - svg draw object
     */
    var CheckBox = function(draw){
      // var draw = SVG().addTo('body');
      var checkbox = new ToggleBox('rectangle', draw);
      return {
        /**
         * moves checkbox to location (x,y)
         * @memberof CheckBox
         * @param  {Number} x
         * @param  {Number} y
         */
        move: function(x, y) {
          checkbox.move(x, y)
        },
        /**
         * sets checkbox's label to text
         * @memberof CheckBox
         * @param  {String} text
         */
        setText: function(text) {
          checkbox.setText(text)
        },
        /**
         * specifies function to be run when checkbox changes state, event is current state (hover, idle, pressed, up)
         * @memberof CheckBox
         * @param  {function} eventHandler
         */
        stateChanged: function(eventHandler){
          checkbox.stateChanged(eventHandler);
        },
        /**
         * specifies function to be run when checkbox is checked, event is MouseEvent
         * @memberof CheckBox
         * @param  {function} eventHandler
         */
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

    /**
     * @param  {Object} draw - svg draw object
     */
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

    /**
     * @name RadioDials
     * @class
     * @param  {Object} draw  - svg draw object
     * @param  {Number} n     - number of radio dials for the group
     */
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
        /**
         * moves radiodial group to location (x,y)
         * @memberof RadioDials
         * @param  {Number} x
         * @param  {Number} y
         */
        move: function(x, y) {
          for (var i=0; i<radioDialsList.length; i++){
            var radioY = radioDialsList[i].src().y();
            radioDialsList[i].move(x, y+ radioY);
          }
        },
        /**
         * @memberof RadioDials
         * @param  {Number} position
         * @param  {String} text
         */
        setText: function(position, text) {
          radioDialsList[position].setText(text);
        },
        /**
         * specifies function to be run when radio dials changes state, event is current state (hover, idle, pressed, up)
         * @memberof RadioDials
         * @param  {function} eventHandler
         */
        stateChanged: function(eventHandler){
          for (var i=0; i<radioDialsList.length; i++){
            radioDialsList[i].stateChanged(eventHandler);
          }
        },
        /**
         * specifies function to be run when radio is checked, event is MouseEvent also specifies which position radio dial was checked
         * @example
         * eventHandler(event, i){
         *   event - current state or MouseEvent   
         *   i - radio dial position that was checked
         * }
         * @memberof RadioDials
         * @param  {function} eventHandler
         */
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

    /**
     * @name TextBox
     * @class
     * @param  {Object} draw - svg draw object
     */
    var TextBox = function(draw){
      var textbox = draw.group();
      var textInput = "";
      var textChangeEvent = null;
      var rect = textbox.rect(200, 30).fill('white').stroke("black")
      var focused = false;
      
      var text = textbox.text(textInput);
      text.font({family: font_family});
      text.x(text.x()+ 3)
      var defaultState = 'idle';
      var stateEvent = null;
      var caret = textbox.line(3, 2.5, 3, 25).stroke({ width: 1, color: 'black' })

      caret.back();
      document.addEventListener("keydown", function(event) {
          if (focused){
            if (event.key == 'Backspace'){  
              if ((textInput.length > 0)){
                textInput = textInput.slice(0, -1);
                text.text(textInput)
                textchange(event.key)
              }          
            }
            else if (event.key == 'Shift'){

            }
            else{
              if (text.length()<(rect.width() - 10)){
                textInput = textInput + event.key;
                text.text(textInput)
                textchange(event.key)
              }
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

      draw.mousedown(function(e){

        var minX = textbox.x();
        var maxX = textbox.x() + textbox.width();

        var minY = textbox.y();
        var maxY = textbox.y() + textbox.height();

        if ((minX < e.offsetX)&&(e.offsetX < maxX)&&(minY < e.offsetY)&&(e.offsetY < maxY)) // down was in range of text box
          focused = true;
        else
          focused = false;
      })
      
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
      textbox.mousedown(function(){
        focused = true;
        defaultState = 'pressed';
        transition(defaultState);
      });
      textbox.mouseup(function(){
        defaultState = 'up';
        transition(defaultState);
      })

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
          /**
           * moves textbox to location (x,y)
           * @memberof TextBox
           * @param  {Number} x
           * @param  {Number} y
           */
          move: function(x, y) {
              textbox.move(x, y);
          },
          src: function(){
              return textbox;
          },
          /**
           * specifies function to be run when textbox changes state, event is current state (hover, idle)
           * @memberof TextBox
           * @param  {function} eventHandler
           */
          stateChanged: function(eventHandler){
            stateEvent = eventHandler;
          },
          /**
           * specifies function to be run when text in the textbox changes (due to user input)
           * @memberof TextBox
           * @param  {function} eventHandler
           */
          textChanged: function(eventHandler){
            textChangeEvent = eventHandler;
          },
          /**
           * returns text from textbox that the user inputted
           * @memberof TextBox
           * @returns {String}  
           */
          getText: function(){
            return textInput;
          }
      }
    }

    /**
     * @name ProgressBar
     * @class
     * @param  {Object} draw - svg draw object
     */
    var ProgressBar = function(draw){
      var progressBar = draw.group();
      var barWidth = 100.0;
      var progressNumber = 0;
      var bar = null;
      var progressChangedEvent  = null;
      var stateEvent = null;

      var bar = progressBar.rect(barWidth,15).fill({color: lighter}).stroke({color: 'black'});
      var progress = progressBar.rect(progressNumber,15).fill({color: primary}).stroke({color: 'black'});

      progressBar.mouseout(function(){
        if (stateEvent != null)
          stateEvent("hover")
      });
      progressBar.mouseover(function(){
        if (stateEvent != null)
          stateEvent("idle")
      });

      return {
        /**
         * set's the width of the bar of the progress bar
         * @memberof ProgressBar
         * @param  {Number} width
         */
        setWidth: function(width){
          barWidth = width
          bar.width(width)
        },
        /**
         * increments progress bar's value by 1
         * @memberof ProgressBar
         */
        incrementProgress: function(){
          if (progressNumber < barWidth)
            progressNumber += 1;
          progress.width(progressNumber);

          if (progressChangedEvent != null){
            progressChangedEvent(progressNumber);
          }
        },
        /**
         * sets progress bar's value to 'number'
         * @memberof ProgressBar
         * @param  {Number} number
         */
        setProgress: function(number){
          progressNumber =  barWidth * (number/100.0);
          progress.width(progressNumber);
        },
        /**
         * gets current progress bar's value
         * @memberof ProgressBar
         */
        getProgress: function(){
          return (progressNumber/barWidth)*100;
        },
        /**
         * moves progress bar to location (x, y)
         * @memberof ProgressBar
         * @param  {Number} x
         * @param  {Number} y
         */
        move: function(x, y){
          progressBar.move(x, y)
        },
        /**
         * specifies function to be run when progress bar's state changes
         * @memberof ProgressBar
         * @param  {function} eventHandler
         */
        stateChanged: function(eventHandler){
          stateEvent = eventHandler;
        },
        /**
         * specifies function to be run when progressbar is incremented
         * @memberof ProgressBar
         * @param  {function} eventHandler
         */
        progressIncremented: function(eventHandler){
          progressChangedEvent = eventHandler;
        }
      }

    }

    /**
     * @name ScrollBar
     * @class
     * @param  {Object} draw - svg draw object
     */
    var ScrollBar = function(draw){
      var scrollbar = draw.group();
      var barHeight = 300;
      var colors = scrollbarColors;
      var defaultState = 'idle';
      var stateEvent = null;
      var barMovedEvent = null;
      var previous = null;

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
        if (previous == null){
          previous = event.offsetY;
        }

        if (defaultState == 'pressed-thumb'){
          var direction = event.movementY;
          var move = event.offsetY - previous;
          if (direction > 0){
            if (thumb.y()+move <= scrollbar.y()+scrollbar.height()-thumb.height()){
              thumb.y(thumb.y()+move);
              barState('down')
            }
          }
          else{
            if (thumb.y()+move >= scrollbar.y()){
              thumb.y(thumb.y()+move);
              barState('up')
            }
          }
        }
        previous = event.offsetY;
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
        if (defaultState != 'pressed-thumb'){
          defaultState = 'hover-thumb';
          transition(defaultState);
        }
      });
      thumb.mouseout(function(){
        if (defaultState != 'pressed-thumb'){
          defaultState = 'idle';
          action(colors.mouseout, 10, thumb);
          transition(defaultState);
        }
      });

      // bar states
      bar.mouseover(function(){
        if (defaultState != 'pressed-thumb'){
          defaultState = 'hover-bar';
          transition(defaultState);
        }
      });
      bar.mouseout(function(){
        if (defaultState != 'pressed-thumb'){
          defaultState = 'idle';
          transition(defaultState );
        }
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
        /**
         * moves scrollbar to location (x, y)
         * @memberof ScrollBar
         * @param  {Number} x
         * @param  {Number} y
         */
        move: function(x,y){
          scrollbar.move(x, y);
        },
        /**
         * specifies function to be run when scrollbar state changes
         * @memberof ScrollBar
         * @param  {function} eventHandler
         */
        stateChanged: function(eventHandler){
          stateEvent = eventHandler;
        },
        /**
         * sets height of scrollbar
         * @memberof ScrollBar
         * @param  {Number} height
         */
        setHeight: function(height){
          barHeight = height;
          bar.height(height);
        },
        /**
         * returns position of thumb in a list, list[0] = x, list[1] = y
         * @memberof ScrollBar
         * @returns {list} 
         */
        getThumbPosition: function(){
          return [thumb.x(), thumb.y()];
        },
        /**
         * specifies function to be run when scrollbar is moved (up or down)
         * @memberof ScrollBar
         * @param  {function} eventHandler
         */
        barMoved: function(eventHandler){
          barMovedEvent = eventHandler;
        }
      }
    }

    /**
     * @name Slider
     * @class
     * @param  {Object} draw - svg draw object
     */
    var Slider = function(draw){
      var slider = draw.group();
      var sliderWidth = 300.0;
      var defaultState = 'idle';
      var stateEvent = null;
      var barMovedEvent = null;
      var percentNumber = 0;
      var previous = null;

      var bar = slider.rect(sliderWidth, 4).fill({color: lighter}).stroke({color: 'black'});
      var thumb = slider.circle(15).fill({color: lighter_dim}).stroke({color: 'black'});
      thumb.move(0, thumb.y() - 5);

      var percent = slider.text(String(percentNumber)).fill({ color: 'black'});
      percent.font({family: font_family});
      percent.css({'pointer-events': 'none'});
      percent.css({'user-select': 'none'});
      percent.move(0, 20)


      // states tracked in window
      draw.mouseup(function(){
        if (defaultState == 'pressed-thumb'){
          defaultState = "up";
          transition(defaultState)
        }

      });
      draw.mousemove(function(event){
        if (previous == null){
          previous = event.offsetX;
        }

        if (defaultState == 'pressed-thumb'){
          var direction = event.movementX;
          var move = event.offsetX - previous;

          if (direction > 0){
            if (thumb.x()+move <= slider.x()+slider.width()-thumb.width()){
              thumb.x(thumb.x()+move)
              barState('right');
              percentNumber += move;
              percent.text(String(Math.ceil((percentNumber/sliderWidth*100)+5)))
            }
          }
          else{
            if (thumb.x()+move >= slider.x()){
              thumb.x(thumb.x()+move);
              barState('left')
              percentNumber += move;
              percent.text(String(Math.round(percentNumber/sliderWidth*100)))
            }
          }
        }
        previous = event.offsetX;
      });
      draw.mousedown(function(event){
        var x = event.offsetX;
        var y = event.offsetY;

        var minX = thumb.x();
        var maxX = thumb.x()+thumb.width();

        var minY = thumb.y();
        var maxY = thumb.y()+thumb.height();
        if (((minX <= x) && (x <= maxX)) && ((minY <= y) && (y <= maxY)))   // make sure you click the thumb of the scroll bar
        {
          defaultState = 'pressed-thumb';
          transition(defaultState);
        }

      })

      // thumb states
      thumb.mouseover(function(){
        // action(colors.mouseover, 100, thumb);
        if (defaultState != 'pressed-thumb'){
          defaultState = 'hover-thumb';
          transition(defaultState);
        }
      });
      thumb.mouseout(function(){
        if (defaultState != 'pressed-thumb'){
          defaultState = 'idle';
          transition(defaultState);
        }
      });

      // bar states
      bar.mouseover(function(){
        if (defaultState != 'pressed-thumb'){
          defaultState = 'hover-bar';
          transition(defaultState);
        }
      });
      bar.mouseout(function(){
        if (defaultState != 'pressed-thumb'){
          defaultState = 'idle';
          transition(defaultState );
        }
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
        /**
         * moves slider to location (x, y)
         * @memberof Slider
         * @param  {Number} x
         * @param  {Number} y
         */
        move: function(x,y){
          slider.move(x, y);
        },
        /**
         * specifies function to be run when slider changes state
         * @memberof Slider
         * @param  {function} eventHandler
         */
        stateChanged: function(eventHandler){
          stateEvent = eventHandler;
        },
        /**
         * @memberof Slider
         * @returns {number} percent the slider is at
         */
        getPercent: function(){
          return percentNumber;
        }
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
