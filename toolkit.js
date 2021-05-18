import {SVG} from './svg.min.js';

var primary = '#9370DB'
var darker = '#7659b3'
var darkest = '#5c458c'
var lighter = '#E6E6FA'
var lighter_dim = '#cecede'

var buttonColors = {'mouseover': darker, 'mouseout': primary, 'mousedown': darkest, 'mouseup': darker};
var uncheckedColors = {'mouseover': lighter_dim, 'mouseout': lighter, 'mousedown': darker, 'mouseup': lighter_dim};
var checkedColors = {'mouseover': darker, 'mouseout': primary, 'mousedown': lighter_dim, 'mouseup': lighter};

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
      

      object.css({cursor: 'pointer'});

      object.mousedown(function(){
        state = 'pressed';
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

      // var draw = SVG().addTo('body').size('400px', '250px');
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

    var TextBox = function(){
      var draw = SVG().addTo('body');
      var textbox = draw.group();
      var rect = textbox.rect(200, 30).fill("white").stroke("black")
      var text = textbox.text("hello").move(2,4);
      var caret = textbox.line(45, 2.5, 45, 25).stroke({ width: 1, color: "black" })
      return {
          move: function(x, y) {
              textbox.move(x, y);
          },
          src: function(){
              return textbox;
          }
      }
    }

    var ProgressBar = function(draw){
      var progressBar = draw.group();
      var barWidth = 100;
      var progressNumber = 0;
      var bar = null;

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
        },
        setProgress: function(number){
          progressNumber =  barWidth * (number/100.0);
          progress.width(progressNumber);
        },
        getProgress: function(){
          return progressNumber;
        },
        move: function(x, y){
          progressBar.move(x, y)
        }
      }

    }


return {Button, ToggleBox, CheckBox, RadioDials, RadioDial, TextBox, ProgressBar}
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