import {MyToolkit} from './toolkit.js';

// FOR ALL WIDGETS, MUST SPECIFY DRAW AS FIRST PARAMETER
var draw = SVG().addTo('body').size('1000px', '1000px');

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
checkbox1.setId("1")

//  --------------------------------------------------------------  RADIO DIALS  -------------------------------------------------------------- //
// RADIO DIAL METHODS:
//
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
radioDials.move(250, 200);

radioDials.oncheck(function(e, i){
	console.log(e, 'position:', i);
});

radioDials.stateChanged(function(e){
    console.log(e, ": radio button")
})

//  ----------------------------------------------------------------  TEXTBOX  ---------------------------------------------------------------- //
var textBox = new MyToolkit.TextBox;
textBox.move(50,50)

//  --------------------------------------------------------------  PROGRESS BAR  -------------------------------------------------------------- //
// PROGRESS BAR METHODS:
//
// move(x, y)                                       - moves progress bar to location (x, y)
// setWidth(width)                                  - set's progress bar's width
// getProgress()                                    - gets current progress bar's value
// incrementProgress()                              - increments progress bar's value by 1
// setProgress(number)                              - sets progress bar's value to 'number'
// TODO: eventhandler for incremented progress bar
// TODO: eventhandler for when widget state changes

var progressBar = new MyToolkit.ProgressBar(draw);
progressBar.move(50, 50)
progressBar.setWidth(300);
console.log("progressbar value: ", progressBar.getProgress())


for(var i=0; i<=300; i++){
    progressBar.incrementProgress();
    await sleep(10);
    if (i >= 300){
        i = 0;
        progressBar.setProgress(0)
    }
}

// sleep function - delay to animate progress bar
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
