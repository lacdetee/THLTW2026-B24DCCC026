import { useEffect, useState } from "react"

interface Subject {
  id: number
  name: string
}

interface Schedule {
  id: number
  subjectId: number
  datetime: string
  duration: number
  content: string
}

export default function Bai2() {
  const [activeTab, setActiveTab] = useState("subjects")
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [goals, setGoals] = useState<{ [key: number]: number }>({})
  const [subjectName, setSubjectName] = useState("")
  const [form, setForm] = useState({
    subjectId: "",
    datetime: "",
    duration: "",
    content: ""
  })

  useEffect(() => {
    setSubjects(JSON.parse(localStorage.getItem("subjects") || "[]"))
    setSchedules(JSON.parse(localStorage.getItem("schedules") || "[]"))
    setGoals(JSON.parse(localStorage.getItem("goals") || "{}"))
  }, [])

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules))
  }, [schedules])

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals))
  }, [goals])

  const addSubject = () => {
    if (!subjectName.trim()) return
    setSubjects([...subjects, { id: Date.now(), name: subjectName }])
    setSubjectName("")
  }

  const deleteSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id))
    setSchedules(schedules.filter(s => s.subjectId !== id))
  }

  const addSchedule = () => {
    if (!form.subjectId || !form.duration) return

    const newSchedule: Schedule = {
      id: Date.now(),
      subjectId: parseInt(form.subjectId),
      datetime: form.datetime,
      duration: parseInt(form.duration),
      content: form.content
    }

    setSchedules([...schedules, newSchedule])
    setForm({
      subjectId: "",
      datetime: "",
      duration: "",
      content: ""
    })
  }

  const deleteSchedule = (id: number) => {
    setSchedules(schedules.filter(s => s.id !== id))
  }

  const calculateTotal = (subjectId: number) =>
    schedules
      .filter(s => s.subjectId === subjectId)
      .reduce((sum, s) => sum + s.duration, 0)

  const calculatePercent = (subjectId: number) => {
    const total = calculateTotal(subjectId)
    const goal = goals[subjectId] || 0
    if (goal === 0) return 0
    return Math.min(100, Math.round((total / goal) * 100))
  }

  return (
    <div style={styles.container}>
      <h2>📚 Quản Lý Học Tập</h2>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={activeTab === "subjects" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("subjects")}
        >
          Môn học
        </button>
        <button
          style={activeTab === "schedule" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("schedule")}
        >
          Lịch học
        </button>
        <button
          style={activeTab === "stats" ? styles.activeTab : styles.tab}
          onClick={() => setActiveTab("stats")}
        >
          Thống kê
        </button>
      </div>

      {/* TAB 1: MÔN HỌC */}
      {activeTab === "subjects" && (
        <div style={styles.card}>
          <h3>Thêm môn học</h3>
          <input
            value={subjectName}
            placeholder="Tên môn..."
            onChange={(e) => setSubjectName(e.target.value)}
            style={styles.input}
          />
          <button onClick={addSubject} style={styles.primaryBtn}>
            Thêm
          </button>

          <hr />

          {subjects.map(subject => (
            <div key={subject.id} style={styles.itemRow}>
              <b>{subject.name}</b>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteSubject(subject.id)}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: LỊCH HỌC */}
      {activeTab === "schedule" && (
        <div style={styles.card}>
          <h3>Thêm lịch học</h3>

          <select
            value={form.subjectId}
            onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
            style={styles.input}
          >
            <option value="">Chọn môn</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={form.datetime}
            onChange={(e) => setForm({ ...form, datetime: e.target.value })}
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Số giờ"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            style={styles.input}
          />

          <input
            placeholder="Nội dung"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            style={styles.input}
          />

          <button onClick={addSchedule} style={styles.primaryBtn}>
            Thêm lịch
          </button>

          <hr />

          {schedules.map(s => (
            <div key={s.id} style={styles.itemRow}>
              <span>
                {subjects.find(sub => sub.id === s.subjectId)?.name} | {s.duration}h
              </span>
              <button
                style={styles.deleteBtn}
                onClick={() => deleteSchedule(s.id)}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: THỐNG KÊ + MỤC TIÊU */}
      {activeTab === "stats" && (
        <div style={styles.card}>
          <h3>🎯 Mục tiêu hàng tháng</h3>

          {subjects.map(subject => {
            const total = calculateTotal(subject.id)
            const percent = calculatePercent(subject.id)
            const goal = goals[subject.id] || 0

            return (
              <div key={subject.id} style={{ marginBottom: 25 }}>
                <b>{subject.name}</b>

                <input
                  type="number"
                  placeholder="Nhập mục tiêu (giờ)"
                  value={goal}
                  onChange={(e) =>
                    setGoals({
                      ...goals,
                      [subject.id]: parseInt(e.target.value) || 0
                    })
                  }
                  style={styles.input}
                />

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: percent + "%",
                      background: percent >= 100 ? "#d70018" : "#999"
                    }}
                  />
                </div>

                <p>
                  {total} / {goal} giờ ({percent}%)
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles: any = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 20
  },
  tabs: {
    display: "flex",
    gap: 10,
    marginBottom: 20
  },
  tab: {
    padding: "10px 20px",
    border: "1px solid #ddd",
    borderRadius: 6,
    background: "#fff",
    cursor: "pointer"
  },
  activeTab: {
    padding: "10px 20px",
    borderRadius: 6,
    border: "none",
    background: "#d70018",
    color: "#fff",
    cursor: "pointer"
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 15px rgba(0,0,0,0.08)"
  },
  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 6,
    border: "1px solid #ccc"
  },
  primaryBtn: {
    padding: 10,
    borderRadius: 6,
    border: "none",
    background: "#d70018",
    color: "#fff",
    cursor: "pointer"
  },
  deleteBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "none",
    background: "#ccc",
    cursor: "pointer"
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0"
  },
  progressBar: {
    width: "100%",
    height: 12,
    background: "#eee",
    borderRadius: 6,
    overflow: "hidden"
  },
  progressFill: {
    height: "100%",
    transition: "0.3s"
  }
}