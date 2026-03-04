import { useState } from "react"

export default function Bai1() {
    const [randomNumber, setRandomNumber] = useState(
        Math.floor(Math.random() * 100) + 1
    )
    const [guess, setGuess] = useState("")
    const [message, setMessage] = useState("")
    const [attempts, setAttempts] = useState(10)

    const handleGuess = () => {
        if (attempts <= 0) return

        const numberGuess = parseInt(guess)

        if (numberGuess === randomNumber) {
            setMessage("Chúc mừng! Bạn đã đoán đúng!")
            setAttempts(0)
        } else if (numberGuess < randomNumber) {
            setMessage("Bạn đoán quá thấp!")
            setAttempts(attempts - 1)
        } else {
            setMessage("Bạn đoán quá cao!")
            setAttempts(attempts - 1)
        }

        if (attempts - 1 === 0 && numberGuess !== randomNumber) {
            setMessage("Bạn đã hết lượt! Số đúng là " + randomNumber)
        }
    }

    const resetGame = () => {
        setRandomNumber(Math.floor(Math.random() * 100) + 1)
        setAttempts(10)
        setMessage("")
        setGuess("")
    }

    return (
        <div>
            <h2>Game đoán số</h2>
            <p>Còn lại: {attempts} lượt</p>
            <input
                type="number"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
            />
            <button onClick={handleGuess}>Đoán</button>
            <button onClick={resetGame}>Chơi lại</button>
            <p>{message}</p>
        </div>
    )
}