import {MyToolkit} from './toolkit.js';

// FOR ALL WIDGETS, MUST SPECIFY DRAW AS FIRST PARAMETER
var draw = SVG().addTo('body').size('1000px', '700px');
console.log(typeof(draw))

//  ----------------------------------------------------------------  BUTTON  ---------------------------------------------------------------- //
// BUTTON METHODS:
//
// setText(text)                                - sets button's label to text
// move(x, y)                                   - moves button to location (x,y)
// onclick(eventHandler)                        - specifies function to be run when button is clicked, event is MouseEvent
// stateChange(eventHandler)                    - specifies function to be run when button changes state, event is current state (hover, idle, pressed, up)
// .. eventHandler(event){
// ..   event - current state or MouseEvent   
// .. }

var btn = new MyToolkit.Button(draw);
btn.setText("button");
btn.move(50, 100);

btn.onclick(function(e){
	console.log("button clicked", e);
});
btn.stateChanged(function(e){
	console.log(e, ": button");
});

//  --------------------------------------------------------------  CHECK BOX  -------------------------------------------------------------- //
// CHECKBOX METHODS:
//
// same methods as button in addition to...
// setId(id)                                    - attaches id to checkbox
// oncheck(eventHandler)                        - similar to button's onclick where oncheck specifies function to be run when checkbox is checked

var checkbox1 = new MyToolkit.CheckBox(draw);
checkbox1.setText('checkbox')
checkbox1.move(50, 200)

checkbox1.stateChanged(function(e){
	console.log(e, ": checkbox");
});
checkbox1.oncheck(function(e){
	console.log('checkbox clicked', e);
});

//  --------------------------------------------------------------  RADIO DIALS  -------------------------------------------------------------- //
// RADIO DIAL METHODS:
//
// constructor(draw, n)                         - n represents number of radio dials in group
// move(x, y)                                   - moves radio dial group (starting from first radio dial) to location (x, y)
// setText(pos, text)                           - sets radio dial's label of position 'pos' to 'text'
// oncheck(eventHandler)                        - specifies function to be run when radio dial is checked, 
// .. eventHandler(event, i){
// ..   event - current state or MouseEvent   
// ..   i - radio dial position that was checked
// .. }

var radioDials = new MyToolkit.RadioDials(draw, 3);
radioDials.setText(0, 'radio dial 1');
radioDials.setText(1, 'radio dial 2');
radioDials.setText(2, 'radio dial 3');
radioDials.move(200, 200);

radioDials.oncheck(function(e, i){
	console.log(e, 'checked position:', i);
});

radioDials.stateChanged(function(e){
    console.log(e, ": radio button")
})

//  ---------------------------------------------------------------  SCROLL BAR  --------------------------------------------------------------- //
var scrollBar = new MyToolkit.ScrollBar(draw);
scrollBar.move(400, 100);
scrollBar.setHeight(200);
console.log(scrollBar.getThumbPosition());
scrollBar.stateChanged(function(e){
	console.log(e, ": scrollbar", " position: ",scrollBar.getThumbPosition());
});
scrollBar.barMoved(function(direction){
    console.log("scroll bar moving ", direction)
})

//  ----------------------------------------------------------------  TEXTBOX  ---------------------------------------------------------------- //
var textBox = new MyToolkit.TextBox(draw);
textBox.move(50,400)

textBox.stateChanged(function(e){
    console.log(e, ": textbox")
});
textBox.textChanged(function(e){
    console.log(e, ":textbox changed, ", "getText():", textBox.getText())
})

//  --------------------------------------------------------------  SLIDER  -------------------------------------------------------------- //
var slider = new MyToolkit.Slider(draw);
slider.move(50, 550)

slider.stateChanged(function(state){
    console.log(state, ":slider")
})

//  --------------------------------------------------------------  PROGRESS BAR  -------------------------------------------------------------- //
// PROGRESS BAR METHODS:
//
// move(x, y)                                       - moves progress bar to location (x, y)
// setWidth(width)                                  - set's progress bar's width
// getProgress()                                    - gets current progress bar's value
// incrementProgress()                              - increments progress bar's value by 1
// setProgress(number)                              - sets progress bar's value to 'number'
// eventhandler for incremented progress bar
// eventhandler for when widget state changes


// moving progress bar by using incrementProgress()
var progressBar1 = new MyToolkit.ProgressBar(draw);
progressBar1.move(50, 325)
progressBar1.setWidth(300);

for(var i=0; i<=100; i++){
    progressBar1.incrementProgress();
    await sleep(25);
    progressBar1.progressIncremented(function(){
        console.log("progress has been incremented, progress: ", progressBar1.getProgress());       // shows getProgress() function
    })
}

progressBar1.stateChanged(function(state){
    console.log(state, ": progress bar1");
})



// constant moving progress bar by using setProgress(x)
var progressbar2 = new MyToolkit.ProgressBar(draw);
progressbar2.move(50, 350)
progressbar2.setWidth(300);

progressbar2.stateChanged(function(state){
    console.log(state, ": progress bar2");
})

for(var i=0; i<=100; i+=10){
    progressbar2.setProgress(i);
    await sleep(175);
    if (i >= 100){
        i = 0;
        progressbar2.setProgress(0)
        await sleep(175);
    }
}


// sleep function - delay to animate progress bar
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}



