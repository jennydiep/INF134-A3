import {MyToolkit} from './toolkit.js';

// Implement a MyToolkit Button

var draw = SVG().addTo('body').size('1000px', '1000px');

var btn = new MyToolkit.Button(draw);

btn.setText("button");
btn.move(50, 100);

btn.onclick(function(e){
	console.log("button clicked", e);
});
btn.stateChanged(function(e){
	console.log(e, ": button");
});

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


var radioDials = new MyToolkit.RadioDials(draw, 3);
radioDials.setText(0, 'radio dial 1')
radioDials.setText(1, 'radio dial 2')
radioDials.setText(2, 'radio dial 3')
radioDials.move(250, 200)
radioDials.oncheck(function(e, i){
	console.log(e, 'position:', i);
});

radioDials.stateChanged(function(e){
    console.log(e, ": radio button")
})

var textBox = new MyToolkit.TextBox;
textBox.move(50,50)


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

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
