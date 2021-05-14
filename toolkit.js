SVG.on(document, 'DOMContentLoaded', function(){
    var draw = SVG().addTo('body').size('1000px','1000px');
    var window = draw.group();
    window.rect(400,400).stroke("orange").fill("white")
    window.click(function(event){
      console.log("Window")
      console.log(event)
    })

    var TextBox = function(draw){
      var textbox = draw.group();
      var rect = textbox.rect(200, 30).fill("white").stroke("black")
      var text = textbox.text("hello").move(2,4);
      // var caret = textbox.line(45, 2.5, 45, 25).stroke({ width: 1, color: "black" })
      return {
          move: function(x, y) {
              rect.move(x, y);
          },
          src: function(){
              return textbox;
          }
      }
    }

    var Button = function(draw){
      var rect = draw.rect(100,50).fill('grey')
      var clickEvent = null
      var stateEvent = null
      var defaultState = "idle"
      
      rect.mouseover(function(){
          this.fill({ color: 'blue'})
          defaultState = "hover"
          transition()
      })
      rect.mouseout(function(){
          this.fill({ color: 'red'})
          defaultState = "idle"
          transition()
      })
      rect.mousedown(function(){
          this.fill({ color: 'red'})
          defaultState = "pressed"
          transition()
      })
      rect.mouseup(function(){
          this.fill({ color: 'red'})
          if (defaultState == "pressed"){
            if(clickEvent != null)
                clickEvent(event)
          }
          defaultState = "up"
          transition()
      })
      rect.mousemove(function(event){
      })
      // rect.click(function(event){
      //     this.fill({ color: 'pink'})
      //     if(clickEvent != null)
      //         clickEvent(event)
      // })
      function transition()
      {
        if(stateEvent != null)
          stateEvent.foreach(() => (r) => {r(defaultState)}

          )
          stateEvent(defaultState)
      }
      return {
          move: function(x, y) {
              rect.move(x, y);
          },
          stateChanged: function(eventHandler){
            stateEvent = eventHandler 
          },
          onclick: function(eventHandler){
              clickEvent = eventHandler
          },
          src: function(){
              return rect;
          },
          setId: function(id){
            rect.attr("id", id)
          }
      }
    }

    var btn = new Button(draw)
    btn.setId("btn1")
    btn.move(20,20);
    btn.onclick(function(event){
      console.log(event)
      console.log(event.target)
    })
    btn.stateChanged(function(event){
      console.log(event)
    })
    btn.stateChanged(function(event){
      //navigate to a new page
    })

    var btn2 = new Button(draw)
    btn2.setId("btn2")
    btn2.move(20,100);
    btn2.onclick(function(event){
      console.log(event)
      console.log(event.target)
    })

    var textbox = new TextBox(draw);

    window.add(textbox.src);

    window.add(btn.src);
    window.add(btn2.src);
    
    window.move(10,10)
});