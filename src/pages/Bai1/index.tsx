import { useState } from "react"

export default function Bai1() {
    const generateNumber = () => Math.floor(Math.random() * 100) + 1

    const [randomNumber, setRandomNumber] = useState(generateNumber())
    const [guess, setGuess] = useState("")
    const [message, setMessage] = useState("")
    const [attempts, setAttempts] = useState(10)
    const [history, setHistory] = useState<number[]>([])

    const handleGuess = () => {
        if (!guess) return

        const numberGuess = parseInt(guess)
        if (numberGuess < 1 || numberGuess > 100) {
            setMessage("Nhập số từ 1 đến 100")
            return
        }

        setHistory([...history, numberGuess])

        if (numberGuess === randomNumber) {
            setMessage("Chúc mừng! Bạn đã đoán đúng!")
            setAttempts(0)
        } else if (numberGuess < randomNumber) {
            setMessage("Số quá thấp!")
            setAttempts(attempts - 1)
        } else {
            setMessage("Số quá cao!")
            setAttempts(attempts - 1)
        }

        setGuess("")
    }

    const resetGame = () => {
        setRandomNumber(generateNumber())
        setAttempts(10)
        setMessage("")
        setGuess("")
        setHistory([])
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Game Đoán Số</h2>
                <p>Còn lại: <b>{attempts}</b> lượt</p>

                <input
                    type="number"
                    value={guess}
                    placeholder="Nhập số..."
                    onChange={(e) => setGuess(e.target.value)}
                    style={styles.input}
                />

                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={handleGuess} style={styles.primaryBtn}>
                        Đoán
                    </button>
                    <button onClick={resetGame} style={styles.secondaryBtn}>
                        Chơi lại
                    </button>
                </div>

                <p style={{ marginTop: 15 }}>{message}</p>

                <div style={{ marginTop: 20 }}>
                    <b>Lịch sử:</b>
                    <p>{history.join(", ") || "Chưa có"}</p>
                </div>
            </div>
        </div>
    )
}

const styles: any = {
    container: {
        display: "flex",
        justifyContent: "center",
        marginTop: 60
    },
    card: {
        width: 400,
        padding: 30,
        borderRadius: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        textAlign: "center",
        background: "#fff"
    },
    input: {
        width: "100%",
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,
        border: "1px solid #ccc"
    },
    primaryBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    border: "none",
    background: "#d70018",
    color: "#fff",
    cursor: "pointer"
},
    secondaryBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 6,
        border: "none",
        background: "#f0f0f0",
        cursor: "pointer"
    }
}