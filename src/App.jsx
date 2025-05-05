import React, { useState, useEffect, useRef } from "react";
import ride from './assets/ride.wav'
import './App.scss'

function App() {
  const [boggleLetterArray, setBoggleLetterArray] = useState(
    [
     "AAEEGN", "ABBJOO", "ACHOPS", "AFFKPS",
     "AOOTTW", "CIMOTU", "DEILRX", "DELRVY",
     "DISTTY", "EEGHNW", "EEINSU", "EHRTVW",
     "EIOSST", "ELRTTY", "HIMNQU", "HLNNRZ"
    ]
  );

  const [gameLetters, setGameLetters] = useState([]);
  const [gameBoard, setGameBoard] = useState();
  const [gameArray, setGameArray] = useState([]);
  const [boardMin, setBoardMin] = useState(0);
  const [time, setTime] = useState('3:00');
  const [interval, setThisInterval] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const timerRef = useRef(null);

  useEffect(()=> {
    timerRef.current = '3:00'
    randomizeBoard();
  }, []);

  useEffect(()=> {
    handleGameArray();
  }, [gameLetters]);

  useEffect(()=> {
    handleGameBoard();
  }, [gameArray]);

  const randomizeBoard = () => {
    handleResetTimer();
    let currentLetterArray = [...boggleLetterArray];
    let gameBoardLetters = []
    for(let i = 0; i <= 15; i++){
      const randomTileNum = getRandomNumber( currentLetterArray.length, boardMin )
      const randomLetterNum = getRandomNumber( 5, boardMin )
      const randomCubeString = currentLetterArray.splice(randomTileNum, 1);
      let cubeCharArr = randomCubeString[0].split("");
      const randomStringLengthNum = getRandomNumber(cubeCharArr.length, boardMin);
      let letter = getRandomArrVal(cubeCharArr, randomStringLengthNum).toString();
      if(letter == 'Q'){ letter = 'Qu'}
      gameBoardLetters.push(letter);
    }
    const game = shuffle(gameBoardLetters);
    setGameLetters(game)
  }

  const shuffle = ( array ) => {
    return  array.sort(() => Math.random() - 0.5);
  }
  const getRandomNumber = (max, min) => {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const getRandomArrVal = (arr, randomNum) => {
    return arr.splice(randomNum, 1);
  }

  const handleGameArray = () => {
    const letterArray = gameLetters.reduce((acc, letter, index, array) => {
      if(index < 4){
        acc[0][index] = letter;
      }
      else if(index < 8){
        acc[1][index - 4] = letter;
      }else if(index < 12){
        acc[2][index - 8] = letter;
      }else if(index < 16){
        acc[3][index - 12] = letter;
      }
      return acc;
    }, [[],[],[],[]]);
    setGameArray(letterArray);
  }

  const handleGameBoard = () => {
    const board = gameArray.reduce((acc, row, index, array) => {
      acc.push(
        <div key={index} className='boggle-row'>{
          row.map((letter, indx) => 
            <div key={indx}  className='boggle-letter'>
              {letter}
            </div>)
        }</div>
      )
      return acc
    }, [])
    setGameBoard(board);
  }

  const handleResetTimer = () => {
    setTimerStarted(false);
    clearInterval(interval);
    timerRef.current = '3:00';
    setTime('3:00')
  }

  const handleStartTimer = () =>{
    let interval = setInterval(() => {
      const currentTimeArr = timerRef.current.split(':');
      let currentMin = parseInt(currentTimeArr[0]);
      let currentSec = parseInt(currentTimeArr[1]);
      if(currentSec <= 0){
        currentMin -= 1;
        currentSec = 59;
      }else{
        currentSec -= 1;
      }

      timerRef.current = (currentSec < 10) ? 
      `${currentMin}:0${currentSec}` : 
      `${currentMin}:${currentSec}`;
      setTime(timerRef.current)

      if ((currentMin <= 0 && currentSec <= 0)) {
        const audio = new Audio(ride);
        if(audio){
          audio.play();
        };
        clearInterval(interval);
        setTime('time expired!');

      }
    }, 1000);
    setTimerStarted(true);
    setThisInterval(interval);
  }

  return(
    <div className='boggle'>
      <div className='boggle__title'><span className='boggle__red'>Bog</span>gle</div>
      <div className='boggle__buttons'>
        <button 
          className='boggle__randomise-board' 
          onClick={ randomizeBoard }>Randomise Board</button>
        <button 
          className='boggle__start-timer'
          onClick={ handleStartTimer } 
          disabled={ timerStarted }>Start Timer</button>
        <button 
          className='boggle__reset-timer' 
          onClick={ handleResetTimer }>Reset Timer</button>
      </div>
      <div ref={ timerRef } className='boggle__timer'>{ time }</div>
      <div className='boggle__board'>
          { gameBoard }
      </div>
    </div>
  ) 
};

export default App
