import { useEffect, useState } from 'react';
import './App.css';
import dog1 from './img/1.jpg'
import dog2 from './img/2.jpg'
import dog3 from './img/3.jpg'
import dog4 from './img/4.jpg'
import dog5 from './img/5.jpg'
import dog6 from './img/6.jpg'
import SingleCard from './components/SingleCard';


const url = "https://dog.ceo/api/breeds/image/random";

const cardImages = [
  { "src": dog1, matched: false },
  { "src": dog2, matched: false },
  { "src": dog3, matched: false },
  { "src": dog4, matched: false },
  { "src": dog5, matched: false },
  { "src": dog6, matched: false }
]
function App() {
  const [cards, setCards] = useState(null)
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disable, setDisable] = useState(false)

  //shuffle cards
  const shuffleCards = async () => {

    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }))
    setCards(shuffledCards)
    setTurns(0)

    try {
      const res = await fetch(url)
      const { message } = await res.json()
      cardImages.push({ "src": message, matched: false })
      cardImages.splice(0, 1)
    } catch (err) {
      console.log(`Could not fetch the data: ${err}`)
    }
  }

  //handel choice
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  useEffect(() => {

    if (choiceOne && choiceTwo) {
      setDisable(true)
      if (choiceOne.src === choiceTwo.src) {
        setCards(prevCards => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else {
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns((prevTurn => prevTurn + 1))
    setDisable(false)
  }

  return (
    <div className="App">
      <h1>Match Game</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className='turns'>Turns : {turns}</div>
      <div className='cards-grid'>
        {cards && cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disable}
          />
        ))}
      </div>

    </div>
  );
}

export default App;
