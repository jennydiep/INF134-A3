import {MyToolkit} from './toolkit.js';

// Implement a MyToolkit Button
var btn = new MyToolkit.Button('hello');

btn.setText("hello");
btn.move(100,100);

btn.onclick(function(e){
	console.log(e);
});
btn.stateChanged(function(e){
	console.log(e);
});

var checkbox1 = new MyToolkit.CheckBox;
checkbox1.setText('testing')
checkbox1.move(100, 100)
checkbox1.stateChanged(function(e){
	console.log(e);
});
checkbox1.oncheck(function(e){
	console.log(e);
});

// var checkbox2 = new MyToolkit.CheckBox;
// checkbox2.move(100, 100)