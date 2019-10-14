import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import  { increment } from './actions';
import './App.css';

function App() { 
  const counter = useSelector(state => state.counter);
  const isLogged = useSelector(state => state.isLogged);
  const dispatch = useDispatch();

  return (
    <div>
       <div className="App">
      Hello World {counter}
    </div>

    <button onClick={()=> dispatch(increment())}>+</button>
    </div>
  );
}

export default App;
