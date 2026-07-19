import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

// ─── GPA Calculator ───────────────────────────────────────
function GPACalculator() {
  const GRADES = [
    { grade: "A+", points: 4.0 }, { grade: "A", points: 4.0 },
    { grade: "A-", points: 3.7 }, { grade: "B+", points: 3.3 },
    { grade: "B", points: 3.0 }, { grade: "B-", points: 2.7 },
    { grade: "C+", points: 2.3 }, { grade: "C", points: 2.0 },
    { grade: "C-", points: 1.7 }, { grade: "D", points: 1.0 },
    { grade: "F", points: 0.0 },
  ];

  const [subjects, setSubjects] = useState([
    { name: "", credits: "3", grade: "A" },
    { name: "", credits: "3", grade: "B+" },
    { name: "", credits: "3", grade: "A-" },
  ]);

  const gpa = (() => {
    let totalPoints = 0, totalCredits = 0;
    subjects.forEach(s => {
      const credits = parseFloat(s.credits) || 0;
      const grade = GRADES.find(g => g.grade === s.grade);
      if (grade && credits > 0) {
        totalPoints += grade.points * credits;
        totalCredits += credits;
      }
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  })();

  const gpaColor = parseFloat(gpa) >= 3.5 ? Colors.success : parseFloat(gpa) >= 2.5 ? Colors.warning : Colors.error;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🎓 GPA Calculator</Text>
      <View style={styles.gpaDisplay}>
        <Text style={[styles.gpaValue, { color: gpaColor }]}>{gpa}</Text>
        <Text style={styles.gpaLabel}>Current GPA</Text>
        <Text style={[styles.gpaGrade, { color: gpaColor }]}>
          {parseFloat(gpa) >= 3.5 ? "Distinction 🏆" : parseFloat(gpa) >= 3.0 ? "Good 👍" : parseFloat(gpa) >= 2.0 ? "Average 📚" : "Needs Improvement ⚠️"}
        </Text>
      </View>
      {subjects.map((s, i) => (
        <View key={i} style={styles.subjectRow}>
          <TextInput
            style={[styles.subjectInput, { flex: 2 }]}
            placeholder={`Subject ${i + 1}`}
            value={s.name}
            onChangeText={v => { const ns = [...subjects]; ns[i].name = v; setSubjects(ns); }}
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={[styles.subjectInput, { flex: 0.6 }]}
            placeholder="Cr"
            keyboardType="numeric"
            value={s.credits}
            onChangeText={v => { const ns = [...subjects]; ns[i].credits = v; setSubjects(ns); }}
            placeholderTextColor={Colors.textMuted}
          />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1.5 }}>
            {GRADES.slice(0, 6).map(g => (
              <TouchableOpacity
                key={g.grade}
                style={[styles.gradeChip, s.grade === g.grade && styles.gradeChipActive]}
                onPress={() => { const ns = [...subjects]; ns[i].grade = g.grade; setSubjects(ns); }}
              >
                <Text style={[styles.gradeChipText, s.grade === g.grade && styles.gradeChipTextActive]}>{g.grade}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={() => setSubjects(subjects.filter((_, idx) => idx !== i))}>
            <Ionicons name="close-circle" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addSubjectBtn} onPress={() => setSubjects([...subjects, { name: "", credits: "3", grade: "A" }])}>
        <Ionicons name="add-circle-outline" size={18} color={Colors.primary} />
        <Text style={styles.addSubjectText}>Add Subject</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Pomodoro Timer ───────────────────────────────────────
function PomodoroTimer() {
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef(null);

  const MODES = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const LABELS = { work: "Focus Time", short: "Short Break", long: "Long Break" };
  const COLORS_MAP = { work: Colors.error, short: Colors.success, long: Colors.primary };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            if (mode === "work") setSessions(s => s + 1);
            Alert.alert("⏰ Time's Up!", mode === "work" ? "Great work! Take a break." : "Break over! Time to focus.");
            return MODES[mode];
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  function switchMode(m) {
    setMode(m);
    setTimeLeft(MODES[m]);
    setRunning(false);
    clearInterval(intervalRef.current);
  }

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  const progress = 1 - timeLeft / MODES[mode];
  const color = COLORS_MAP[mode];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🍅 Pomodoro Timer</Text>
      <View style={styles.modeRow}>
        {Object.keys(MODES).map(m => (
          <TouchableOpacity key={m} style={[styles.modeBtn, mode === m && { backgroundColor: COLORS_MAP[m] }]} onPress={() => switchMode(m)}>
            <Text style={[styles.modeBtnText, mode === m && { color: Colors.white }]}>{LABELS[m]}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.timerCircle, { borderColor: color }]}>
        <Text style={[styles.timerText, { color }]}>{mins}:{secs}</Text>
        <Text style={styles.timerLabel}>{LABELS[mode]}</Text>
        <View style={[styles.timerProgress, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.timerControls}>
        <TouchableOpacity style={[styles.timerBtn, { backgroundColor: color }]} onPress={() => setRunning(!running)}>
          <Ionicons name={running ? "pause" : "play"} size={24} color={Colors.white} />
          <Text style={styles.timerBtnText}>{running ? "Pause" : "Start"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.timerResetBtn} onPress={() => { setRunning(false); setTimeLeft(MODES[mode]); }}>
          <Ionicons name="refresh-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.sessionsText}>🍅 Sessions completed today: {sessions}</Text>
    </View>
  );
}

// ─── Exam Countdown ───────────────────────────────────────
function ExamCountdown() {
  const [exams, setExams] = useState([
    { id: 1, name: "MDCAT 2025", date: "2025-09-14", color: Colors.error },
    { id: 2, name: "ECAT 2025", date: "2025-08-10", color: Colors.primary },
    { id: 3, name: "Mid Term Exams", date: "2025-07-15", color: Colors.warning },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [newExam, setNewExam] = useState({ name: "", date: "" });

  function getDaysLeft(dateStr) {
    const diff = new Date(dateStr) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>📅 Exam Countdown</Text>
        <TouchableOpacity onPress={() => setShowAdd(!showAdd)}>
          <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>
      {showAdd && (
        <View style={styles.addExamForm}>
          <TextInput style={styles.addExamInput} placeholder="Exam name..." value={newExam.name} onChangeText={v => setNewExam(p => ({ ...p, name: v }))} placeholderTextColor={Colors.textMuted} />
          <TextInput style={styles.addExamInput} placeholder="Date (YYYY-MM-DD)" value={newExam.date} onChangeText={v => setNewExam(p => ({ ...p, date: v }))} placeholderTextColor={Colors.textMuted} />
          <TouchableOpacity style={styles.addExamBtn} onPress={() => {
            if (!newExam.name || !newExam.date) return;
            setExams(p => [...p, { id: Date.now(), ...newExam, color: Colors.primary }]);
            setNewExam({ name: "", date: "" });
            setShowAdd(false);
          }}>
            <Text style={styles.addExamBtnText}>Add Exam</Text>
          </TouchableOpacity>
        </View>
      )}
      {exams.sort((a, b) => new Date(a.date) - new Date(b.date)).map(exam => {
        const days = getDaysLeft(exam.date);
        return (
          <View key={exam.id} style={[styles.examItem, { borderLeftColor: exam.color }]}>
            <View style={styles.examInfo}>
              <Text style={styles.examName}>{exam.name}</Text>
              <Text style={styles.examDate}>{exam.date}</Text>
            </View>
            <View style={[styles.daysBox, { backgroundColor: days < 7 ? Colors.error + "20" : days < 30 ? Colors.warning + "20" : Colors.success + "20" }]}>
              <Text style={[styles.daysNum, { color: days < 7 ? Colors.error : days < 30 ? Colors.warning : Colors.success }]}>
                {days > 0 ? days : 0}
              </Text>
              <Text style={[styles.daysLabel, { color: days < 7 ? Colors.error : days < 30 ? Colors.warning : Colors.success }]}>
                {days > 0 ? "days" : "past"}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setExams(exams.filter(e => e.id !== exam.id))}>
              <Ionicons name="close-circle-outline" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

// ─── Task Tracker ─────────────────────────────────────────
function TaskTracker() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete Biology Chapter 5", done: false, priority: "high" },
    { id: 2, title: "Solve 20 MDCAT MCQs", done: false, priority: "high" },
    { id: 3, title: "Watch Physics lecture", done: true, priority: "medium" },
    { id: 4, title: "Revise Chemistry formulas", done: false, priority: "low" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("medium");

  const PRIORITY_COLORS = { high: Colors.error, medium: Colors.warning, low: Colors.success };
  const done = tasks.filter(t => t.done).length;
  const progress = tasks.length > 0 ? (done / tasks.length) * 100 : 0;

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>✅ Task Tracker</Text>
      <View style={styles.progressBox}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>Today's Progress</Text>
          <Text style={styles.progressCount}>{done}/{tasks.length}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressPct}>{Math.round(progress)}% completed</Text>
      </View>
      <View style={styles.addTaskRow}>
        <TextInput
          style={styles.addTaskInput}
          placeholder="Add new task..."
          value={newTask}
          onChangeText={setNewTask}
          placeholderTextColor={Colors.textMuted}
        />
        <View style={styles.priorityRow}>
          {["high", "medium", "low"].map(p => (
            <TouchableOpacity key={p} style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[p], opacity: priority === p ? 1 : 0.3 }]} onPress={() => setPriority(p)} />
          ))}
        </View>
        <TouchableOpacity style={styles.addTaskBtn} onPress={() => {
          if (!newTask.trim()) return;
          setTasks(p => [...p, { id: Date.now(), title: newTask.trim(), done: false, priority }]);
          setNewTask("");
        }}>
          <Ionicons name="add" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
      {tasks.map(task => (
        <TouchableOpacity
          key={task.id}
          style={[styles.taskItem, task.done && styles.taskDone]}
          onPress={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
        >
          <View style={[styles.taskCheck, task.done && styles.taskCheckDone]}>
            {task.done && <Ionicons name="checkmark" size={12} color={Colors.white} />}
          </View>
          <Text style={[styles.taskTitle, task.done && styles.taskTitleDone]}>{task.title}</Text>
          <View style={[styles.taskPriorityDot, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />
          <TouchableOpacity onPress={() => setTasks(tasks.filter(t => t.id !== task.id))}>
            <Ionicons name="close-circle-outline" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ─── Study Streak ─────────────────────────────────────────
function StudyStreak() {
  const [streak, setStreak] = useState(7);
  const [studiedToday, setStudiedToday] = useState(false);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const studied = [true, true, true, true, false, true, studiedToday];

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>🔥 Study Streak</Text>
      <View style={styles.streakDisplay}>
        <Text style={styles.streakNum}>{streak}</Text>
        <Text style={styles.streakLabel}>Day Streak 🔥</Text>
      </View>
      <View style={styles.streakDays}>
        {days.map((day, i) => (
          <View key={day} style={styles.streakDay}>
            <View style={[styles.streakDot, { backgroundColor: studied[i] ? Colors.gold : Colors.border }]}>
              {studied[i] && <Ionicons name="checkmark" size={10} color={Colors.white} />}
            </View>
            <Text style={styles.streakDayLabel}>{day}</Text>
          </View>
        ))}
      </View>
      {!studiedToday && (
        <TouchableOpacity style={styles.markStudiedBtn} onPress={() => { setStudiedToday(true); setStreak(s => s + 1); }}>
          <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
          <Text style={styles.markStudiedText}>Mark Today as Studied</Text>
        </TouchableOpacity>
      )}
      {studiedToday && (
        <View style={styles.studiedBadge}>
          <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
          <Text style={styles.studiedBadgeText}>You studied today! Amazing! 🎉</Text>
        </View>
      )}
    </View>
  );
}

// ─── Timetable ────────────────────────────────────────────
function Timetable() {
  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const [schedule, setSchedule] = useState({
    Mon: [{ time: "8:00 AM", subject: "Mathematics", room: "Room 101" }],
    Tue: [{ time: "9:00 AM", subject: "Physics", room: "Lab 2" }],
    Wed: [{ time: "10:00 AM", subject: "Chemistry", room: "Room 205" }],
    Thu: [{ time: "8:00 AM", subject: "Biology", room: "Room 103" }],
    Fri: [{ time: "11:00 AM", subject: "English", room: "Room 301" }],
  });
  const [activeDay, setActiveDay] = useState("Mon");

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>📆 Timetable</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {DAYS.map(d => (
          <TouchableOpacity key={d} style={[styles.dayBtn, activeDay === d && styles.dayBtnActive]} onPress={() => setActiveDay(d)}>
            <Text style={[styles.dayBtnText, activeDay === d && styles.dayBtnTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {schedule[activeDay]?.length === 0 ? (
        <Text style={styles.noClassText}>No classes scheduled</Text>
      ) : (
        schedule[activeDay]?.map((cls, i) => (
          <View key={i} style={styles.classItem}>
            <View style={styles.classTime}>
              <Text style={styles.classTimeText}>{cls.time}</Text>
            </View>
            <View style={styles.classInfo}>
              <Text style={styles.classSubject}>{cls.subject}</Text>
              <Text style={styles.classRoom}>{cls.room}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

// ─── Main Planner Screen ──────────────────────────────────
export default function PlannerScreen() {
  const TABS = [
    { id: "tasks", label: "Tasks", icon: "checkbox-outline" },
    { id: "timer", label: "Timer", icon: "timer-outline" },
    { id: "exams", label: "Exams", icon: "calendar-outline" },
    { id: "gpa", label: "GPA", icon: "school-outline" },
    { id: "streak", label: "Streak", icon: "flame-outline" },
    { id: "timetable", label: "Schedule", icon: "time-outline" },
  ];

  const [activeTab, setActiveTab] = useState("tasks");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Student Planner 📚</Text>
        <Text style={styles.headerSubtitle}>Stay organized & achieve your goals</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.plannerTab, activeTab === tab.id && styles.plannerTabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons name={tab.icon} size={16} color={activeTab === tab.id ? Colors.white : Colors.textSecondary} />
            <Text style={[styles.plannerTabText, activeTab === tab.id && styles.plannerTabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {activeTab === "tasks" && <TaskTracker />}
        {activeTab === "timer" && <PomodoroTimer />}
        {activeTab === "exams" && <ExamCountdown />}
        {activeTab === "gpa" && <GPACalculator />}
        {activeTab === "streak" && <StudyStreak />}
        {activeTab === "timetable" && <Timetable />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  tabsScroll: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border, maxHeight: 60 },
  plannerTab: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: Colors.background },
  plannerTabActive: { backgroundColor: Colors.primary },
  plannerTabText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  plannerTabTextActive: { color: Colors.white },
  content: { flex: 1 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 16 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  gpaDisplay: { alignItems: "center", paddingVertical: 20, backgroundColor: Colors.background, borderRadius: 16, marginBottom: 16 },
  gpaValue: { fontSize: 48, fontFamily: Fonts.bold },
  gpaLabel: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 4 },
  gpaGrade: { fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold, marginTop: 8 },
  subjectRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  subjectInput: { backgroundColor: Colors.background, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 10, paddingVertical: 8, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  gradeChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border, marginRight: 6 },
  gradeChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  gradeChipText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  gradeChipTextActive: { color: Colors.white },
  addSubjectBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, justifyContent: "center" },
  addSubjectText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.primary },
  modeRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  modeBtn: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: Colors.background, alignItems: "center" },
  modeBtnText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  timerCircle: { width: 180, height: 180, borderRadius: 90, borderWidth: 6, alignSelf: "center", alignItems: "center", justifyContent: "center", marginBottom: 20, position: "relative", overflow: "hidden" },
  timerText: { fontSize: 42, fontFamily: Fonts.bold },
  timerLabel: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary },
  timerProgress: { position: "absolute", bottom: 0, left: 0, height: 4 },
  timerControls: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 },
  timerBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  timerBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  timerResetBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" },
  sessionsText: { textAlign: "center", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary },
  examItem: { flexDirection: "row", alignItems: "center", borderLeftWidth: 4, paddingLeft: 12, paddingVertical: 10, marginBottom: 10, backgroundColor: Colors.background, borderRadius: 10 },
  examInfo: { flex: 1 },
  examName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  examDate: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 2 },
  daysBox: { alignItems: "center", borderRadius: 10, padding: 8, marginRight: 10 },
  daysNum: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  daysLabel: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular },
  addExamForm: { backgroundColor: Colors.background, borderRadius: 12, padding: 12, marginBottom: 14 },
  addExamInput: { backgroundColor: Colors.white, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 8, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 8 },
  addExamBtn: { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 10, alignItems: "center" },
  addExamBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
  progressBox: { backgroundColor: Colors.background, borderRadius: 12, padding: 14, marginBottom: 14 },
  progressLabelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressLabel: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  progressCount: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary },
  progressBar: { height: 10, backgroundColor: Colors.white, borderRadius: 5, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: Colors.primary, borderRadius: 5 },
  progressPct: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 6 },
  addTaskRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  addTaskInput: { flex: 1, backgroundColor: Colors.background, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, paddingVertical: 8, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  priorityRow: { flexDirection: "row", gap: 4 },
  priorityDot: { width: 12, height: 12, borderRadius: 6 },
  addTaskBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  taskItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.background, borderRadius: 10, padding: 12, marginBottom: 8, gap: 10 },
  taskDone: { opacity: 0.6 },
  taskCheck: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  taskCheckDone: { backgroundColor: Colors.primary },
  taskTitle: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary },
  taskTitleDone: { textDecorationLine: "line-through", color: Colors.textMuted },
  taskPriorityDot: { width: 8, height: 8, borderRadius: 4 },
  streakDisplay: { alignItems: "center", paddingVertical: 16 },
  streakNum: { fontSize: 56, fontFamily: Fonts.bold, color: Colors.gold },
  streakLabel: { fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginTop: 4 },
  streakDays: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  streakDay: { alignItems: "center", gap: 4 },
  streakDot: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  streakDayLabel: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary },
  markStudiedBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.success, borderRadius: 12, paddingVertical: 12 },
  markStudiedText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  studiedBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.success + "15", borderRadius: 12, paddingVertical: 12 },
  studiedBadgeText: { color: Colors.success, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
  dayBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.background, marginRight: 8 },
  dayBtnActive: { backgroundColor: Colors.primary },
  dayBtnText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  dayBtnTextActive: { color: Colors.white },
  noClassText: { textAlign: "center", color: Colors.textMuted, fontSize: Fonts.sizes.sm, paddingVertical: 20 },
  classItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.background, borderRadius: 12, padding: 12, marginBottom: 8 },
  classTime: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 12 },
  classTimeText: { color: Colors.white, fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold },
  classInfo: { flex: 1 },
  classSubject: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  classRoom: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 2 },
});
