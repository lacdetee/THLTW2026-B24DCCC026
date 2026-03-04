import { useEffect, useState } from "react"

export default function Bai2() {
    const [subjects, setSubjects] = useState<any[]>([])
    const [subjectName, setSubjectName] = useState("")
    const [duration, setDuration] = useState("")
    const [selectedSubject, setSelectedSubject] = useState("")
    const [goals, setGoals] = useState<any>({})

    useEffect(() => {
        const savedSubjects = JSON.parse(localStorage.getItem("subjects") || "[]")
        const savedGoals = JSON.parse(localStorage.getItem("goals") || "{}")
        setSubjects(savedSubjects)
        setGoals(savedGoals)
    }, [])

    useEffect(() => {
        localStorage.setItem("subjects", JSON.stringify(subjects))
    }, [subjects])

    useEffect(() => {
        localStorage.setItem("goals", JSON.stringify(goals))
    }, [goals])

    const addSubject = () => {
        const newSubject = {
            id: Date.now(),
            name: subjectName,
            total: 0
        }
        setSubjects([...subjects, newSubject])
        setSubjectName("")
    }

    const addStudyTime = () => {
        const updated = subjects.map((s) =>
            s.id == selectedSubject
                ? { ...s, total: s.total + parseInt(duration) }
                : s
        )
        setSubjects(updated)
        setDuration("")
    }

    const setGoal = (id: number, value: string) => {
        setGoals({ ...goals, [id]: parseInt(value) })
    }

    return (
        <div>
            <h2>Quản lý học tập</h2>

            <h3>Thêm môn học</h3>
            <input
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
            />
            <button onClick={addSubject}>Thêm</button>

            <h3>Thêm thời gian học</h3>
            <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
            >
                <option value="">Chọn môn</option>
                {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                        {s.name}
                    </option>
                ))}
            </select>
            <input
                type="number"
                placeholder="Số giờ"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
            />
            <button onClick={addStudyTime}>Thêm giờ</button>

            <h3>Danh sách môn</h3>
            {subjects.map((s) => (
                <div key={s.id}>
                    <p>
                        {s.name} - Đã học: {s.total} giờ
                    </p>
                    <input
                        type="number"
                        placeholder="Mục tiêu"
                        onChange={(e) => setGoal(s.id, e.target.value)}
                    />
                    <p>
                        {s.total >= (goals[s.id] || 0)
                            ? "Đạt mục tiêu"
                            : "Chưa đạt"}
                    </p>
                </div>
            ))}
        </div>
    )
}