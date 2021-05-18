// TODO: bugs to fix: when creating a widget (for ex in demo.js) if you move the widget before using setText will not place the text on the widget

import {SVG} from './svg.min.js';

var primary = '#9370DB'
var darker = '#7659b3'
var darkest = '#5c458c'
var lighter = '#E6E6FA'
var lighter_dim = '#cecede'

var buttonColors = {'mouseover': darker, 'mouseout': primary, 'mousedown': darkest, 'mouseup': darker};
var uncheckedColors = {'mouseover': lighter_dim, 'mouseout': lighter, 'mousedown': darker, 'mouseup': lighter_dim};
var checkedColors = {'mouseover': darker, 'mouseout': primary, 'mousedown': lighter_dim, 'mouseup': lighter};

var font_family = 'Georgia';
// var size = "25%";

var MyToolkit = (function() {

    var Button = function(){
      var draw = SVG().addTo('body');
      var button = draw.group();
      var clickEvent = null;
      var stateEvent = null;

      var rect = button.rect(100,50).fill({color: primary});
      button.css({cursor: 'pointer'});

      var buttonText = button.text('').fill({ color: lighter});

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
          buttonText = button.text(text).fill({ color: lighter});
          buttonText.css({'pointer-events': 'none'});
          buttonText.center(0.5*rect.width(), 0.5*rect.height());
          buttonText.font({family: font_family});
        },
        move: function(x, y) {
          button.move(x, y);
        },
        stateChanged: function(eventHandler){
          stateEvent = eventHandler 
        },
        onclick: function(eventHandler){
          clickEvent = eventHandler
        }
      }
    }

    var CheckBox = function(){
      var draw = SVG().addTo('body');
      var checkbox = draw.group();
      var rect = checkbox.rect(20,20).fill(lighter);
      var check = false;
      var state = 'idle'
      var stateEvent = null;
      var checkedEvent = null;
      var colors = uncheckedColors;

      // var checkboxColors = {'checked': checkedColors, 'unchecked': uncheckedColors};


      var checkboxText = checkbox.text('').fill({ color: 'black'});
      
      // checkboxActions(rect, rect, checkboxColors, transition, checked);
      // buttonActions(checkbox, rect, colors, transition);
      // var buttonAction = new ButtonActions(checkbox, rect, colors, transition);

      rect.mousedown(function(){
        state = 'pressed';
        transition(state);
      });
      rect.mouseout(function(){
        state = 'idle';
        transition(state);
      });
      rect.mouseup(function(){
        state = 'up';
        transition(state);
      });
      rect.click(function(event){
        if(checkedEvent != null)
          checkedEvent(event);
        if (check){
          check = false;
          action(lighter, 150, rect);
          colors = checkedColors;
        }
        else{
          check = true;
          action(primary, 150, rect);
          colors = uncheckedColors;
        }
      });

      function transition(defaultState){
        if (stateEvent != null)
          stateEvent(defaultState);
      }

      return {
        move: function(x, y) {
          checkbox.move(x, y)
        },
        setText: function(text) {
          checkboxText = checkbox.text(text).fill({ color: 'black'});
          checkboxText.center(0.5*rect.width(), 0.5*rect.height());
          checkboxText.move(30, 0);
          checkboxText.font({family: font_family});
        },
        stateChanged: function(eventHandler){
          stateEvent = eventHandler 
        },
        oncheck: function(eventHandler){
          checkedEvent = eventHandler
        }
      }

    }
return {Button, CheckBox}
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