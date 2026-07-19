import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const EXAMS = [
  { id: "mdcat", name: "MDCAT", icon: "medical-outline", color: "#EF4444", duration: 120 },
  { id: "ecat", name: "ECAT", icon: "construct-outline", color: "#3B82F6", duration: 120 },
  { id: "nts", name: "NTS", icon: "document-text-outline", color: "#10B981", duration: 90 },
  { id: "css", name: "CSS", icon: "ribbon-outline", color: "#8B5CF6", duration: 180 },
  { id: "ppsc", name: "PPSC", icon: "briefcase-outline", color: "#F59E0B", duration: 90 },
  { id: "fast", name: "FAST NET", icon: "code-slash-outline", color: "#EC4899", duration: 60 },
];

export default function MockTestsScreen() {
  const { user } = useAuth();
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [pastResults, setPastResults] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            submitTest();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [testStarted]);

  async function loadQuestions(examId) {
    setLoading(true);
    try {
      const q = query(collection(db, "mcqs"), where("category", "==", examId.toUpperCase()));
      const snapshot = await getDocs(q);
      const allQ = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const shuffled = allQ.sort(() => Math.random() - 0.5).slice(0, Math.min(allQ.length, 30));
      setQuestions(shuffled);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  async function startTest(exam) {
    setSelectedExam(exam);
    await loadQuestions(exam.id);
    setAnswers({});
    setCurrentQ(0);
    setTimeLeft(exam.duration * 60);
    setTestStarted(true);
    setShowResult(false);
  }

  async function submitTest() {
    clearInterval(timerRef.current);
    setTestStarted(false);

    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    questions.forEach(q => {
      if (answers[q.id] === undefined || answers[q.id] === null) {
        skipped++;
      } else if (answers[q.id] === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const resultData = {
      examName: selectedExam.name,
      total: questions.length,
      correct, wrong, skipped, score,
      date: new Date().toLocaleDateString(),
    };

    setResult(resultData);
    setShowResult(true);

    try {
      await addDoc(collection(db, "testResults"), {
        ...resultData,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
    } catch (e) { console.log(e); }
  }

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  const timePercent = selectedExam ? timeLeft / (selectedExam.duration * 60) : 1;
  const answered = Object.keys(answers).length;

  if (showResult && result) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <View style={[styles.resultHeader, { backgroundColor: result.score >= 70 ? Colors.success : result.score >= 50 ? Colors.warning : Colors.error }]}>
          <Ionicons name={result.score >= 70 ? "trophy-outline" : result.score >= 50 ? "thumbs-up-outline" : "refresh-outline"} size={48} color={Colors.white} />
          <Text style={styles.resultTitle}>{result.score >= 70 ? "Excellent! 🏆" : result.score >= 50 ? "Good Job! 👍" : "Keep Practicing! 💪"}</Text>
          <Text style={styles.resultScore}>{result.score}%</Text>
          <Text style={styles.resultExam}>{result.examName} Mock Test</Text>
        </View>

        <View style={styles.resultStats}>
          {[
            { label: "Correct", value: result.correct, color: Colors.success, icon: "checkmark-circle-outline" },
            { label: "Wrong", value: result.wrong, color: Colors.error, icon: "close-circle-outline" },
            { label: "Skipped", value: result.skipped, color: Colors.warning, icon: "remove-circle-outline" },
            { label: "Total", value: result.total, color: Colors.primary, icon: "list-outline" },
          ].map((stat, i) => (
            <View key={i} style={styles.resultStat}>
              <Ionicons name={stat.icon} size={24} color={stat.color} />
              <Text style={[styles.resultStatNum, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.resultStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.performanceBar}>
          <Text style={styles.performanceLabel}>Performance</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${result.score}%`, backgroundColor: result.score >= 70 ? Colors.success : result.score >= 50 ? Colors.warning : Colors.error }]} />
          </View>
          <Text style={styles.performanceValue}>{result.score}%</Text>
        </View>

        <Text style={styles.reviewTitle}>Question Review</Text>
        {questions.map((q, i) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.correctAnswer;
          const isSkipped = userAnswer === undefined;
          return (
            <View key={q.id} style={[styles.reviewCard, { borderLeftColor: isSkipped ? Colors.warning : isCorrect ? Colors.success : Colors.error }]}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewQNum}>Q{i + 1}</Text>
                <Ionicons
                  name={isSkipped ? "remove-circle" : isCorrect ? "checkmark-circle" : "close-circle"}
                  size={18}
                  color={isSkipped ? Colors.warning : isCorrect ? Colors.success : Colors.error}
                />
              </View>
              <Text style={styles.reviewQuestion}>{q.question}</Text>
              {!isSkipped && (
                <Text style={[styles.reviewAnswer, { color: isCorrect ? Colors.success : Colors.error }]}>
                  Your answer: {q.options?.[userAnswer]}
                </Text>
              )}
              {!isCorrect && (
                <Text style={[styles.reviewAnswer, { color: Colors.success }]}>
                  Correct: {q.options?.[q.correctAnswer]}
                </Text>
              )}
              {q.explanation ? <Text style={styles.reviewExplanation}>💡 {q.explanation}</Text> : null}
            </View>
          );
        })}

        <TouchableOpacity style={styles.retryBtn} onPress={() => { setShowResult(false); setSelectedExam(null); }}>
          <Ionicons name="refresh-outline" size={18} color={Colors.white} />
          <Text style={styles.retryBtnText}>Take Another Test</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  if (testStarted && questions.length > 0) {
    const q = questions[currentQ];
    return (
      <View style={styles.container}>
        <View style={[styles.testHeader, { backgroundColor: selectedExam?.color }]}>
          <View style={styles.testHeaderTop}>
            <Text style={styles.testTitle}>{selectedExam?.name} Mock Test</Text>
            <View style={[styles.timerBox, { backgroundColor: timePercent < 0.2 ? Colors.error : "rgba(255,255,255,0.2)" }]}>
              <Ionicons name="timer-outline" size={14} color={Colors.white} />
              <Text style={styles.timerText}>{mins}:{secs}</Text>
            </View>
          </View>
          <View style={styles.testProgress}>
            <Text style={styles.testProgressText}>Q{currentQ + 1}/{questions.length} • {answered} answered</Text>
            <View style={styles.testProgressBar}>
              <View style={[styles.testProgressFill, { width: `${((currentQ + 1) / questions.length) * 100}%` }]} />
            </View>
          </View>
        </View>

        <ScrollView style={styles.testBody} contentContainerStyle={{ padding: 16 }}>
          <View style={styles.questionCard}>
            <View style={styles.questionNum}>
              <Text style={styles.questionNumText}>Q{currentQ + 1}</Text>
            </View>
            <Text style={styles.questionText}>{q.question}</Text>
          </View>

          {q.options?.map((opt, i) => {
            const isSelected = answers[q.id] === i;
            return (
              <TouchableOpacity
                key={i}
                style={[styles.optionBtn, isSelected && styles.optionBtnSelected]}
                onPress={() => setAnswers(prev => ({ ...prev, [q.id]: i }))}
              >
                <View style={[styles.optionLetter, isSelected && styles.optionLetterSelected]}>
                  <Text style={[styles.optionLetterText, isSelected && { color: Colors.white }]}>
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.testFooter}>
          <TouchableOpacity
            style={[styles.navBtn, currentQ === 0 && styles.navBtnDisabled]}
            onPress={() => setCurrentQ(q => Math.max(0, q - 1))}
            disabled={currentQ === 0}
          >
            <Ionicons name="arrow-back" size={20} color={currentQ === 0 ? Colors.textMuted : Colors.primary} />
            <Text style={[styles.navBtnText, currentQ === 0 && { color: Colors.textMuted }]}>Prev</Text>
          </TouchableOpacity>

          {currentQ < questions.length - 1 ? (
            <TouchableOpacity style={[styles.navBtn, styles.navBtnNext]} onPress={() => setCurrentQ(q => q + 1)}>
              <Text style={styles.navBtnNextText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.navBtn, styles.submitTestBtn]} onPress={() => {
              Alert.alert("Submit Test", `You've answered ${answered}/${questions.length} questions. Submit?`, [
                { text: "Cancel" },
                { text: "Submit", onPress: submitTest },
              ]);
            }}>
              <Text style={styles.navBtnNextText}>Submit</Text>
              <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mock Tests 📝</Text>
        <Text style={styles.headerSubtitle}>Test yourself with timed mock exams</Text>
      </View>

      <View style={styles.body}>
        {loading ? (
          <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} />
        ) : (
          <>
            <Text style={styles.sectionTitle}>Select Exam</Text>
            <View style={styles.examGrid}>
              {EXAMS.map(exam => (
                <TouchableOpacity key={exam.id} style={styles.examCard} onPress={() => startTest(exam)} activeOpacity={0.8}>
                  <View style={[styles.examIcon, { backgroundColor: exam.color + "18" }]}>
                    <Ionicons name={exam.icon} size={32} color={exam.color} />
                  </View>
                  <Text style={styles.examName}>{exam.name}</Text>
                  <Text style={styles.examDuration}>⏱ {exam.duration} mins</Text>
                  <View style={[styles.startBtn, { backgroundColor: exam.color }]}>
                    <Text style={styles.startBtnText}>Start Test</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
              <Text style={styles.infoText}>
                Questions are loaded from our MCQ database. Add more MCQs from Admin Panel to make tests longer!
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 28, paddingHorizontal: 20 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  body: { padding: 16 },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 14 },
  examGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 },
  examCard: { width: "47%", backgroundColor: Colors.white, borderRadius: 16, padding: 16, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  examIcon: { width: 60, height: 60, borderRadius: 18, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  examName: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 4 },
  examDuration: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginBottom: 12 },
  startBtn: { borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8, width: "100%", alignItems: "center" },
  startBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  infoBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, backgroundColor: Colors.info + "10", borderRadius: 12, padding: 12 },
  infoText: { flex: 1, fontSize: Fonts.sizes.xs, color: Colors.info, lineHeight: 18 },
  testHeader: { paddingTop: 56, paddingBottom: 16, paddingHorizontal: 16 },
  testHeaderTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  testTitle: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  timerBox: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  timerText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  testProgress: { gap: 6 },
  testProgressText: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.xs },
  testProgressBar: { height: 6, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 3, overflow: "hidden" },
  testProgressFill: { height: "100%", backgroundColor: Colors.white, borderRadius: 3 },
  testBody: { flex: 1 },
  questionCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 14 },
  questionNum: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  questionNumText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  questionText: { fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold, color: Colors.textPrimary, lineHeight: 24 },
  optionBtn: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1.5, borderColor: Colors.border, gap: 12 },
  optionBtnSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + "08" },
  optionLetter: { width: 30, height: 30, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  optionLetterSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionLetterText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  optionText: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary },
  optionTextSelected: { color: Colors.primary, fontFamily: Fonts.semiBold },
  testFooter: { flexDirection: "row", gap: 12, padding: 16, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  navBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: Colors.background, borderRadius: 12, paddingVertical: 12, borderWidth: 1.5, borderColor: Colors.border },
  navBtnDisabled: { opacity: 0.4 },
  navBtnText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.primary },
  navBtnNext: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  navBtnNextText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  submitTestBtn: { backgroundColor: Colors.success, borderColor: Colors.success },
  resultHeader: { borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 20 },
  resultTitle: { color: Colors.white, fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold, marginTop: 10 },
  resultScore: { color: Colors.white, fontSize: 56, fontFamily: Fonts.bold, marginTop: 8 },
  resultExam: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, marginTop: 4 },
  resultStats: { flexDirection: "row", backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  resultStat: { flex: 1, alignItems: "center", gap: 4 },
  resultStatNum: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  resultStatLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  performanceBar: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 16 },
  performanceLabel: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginBottom: 8 },
  progressBar: { height: 12, backgroundColor: Colors.background, borderRadius: 6, overflow: "hidden", marginBottom: 6 },
  progressFill: { height: "100%", borderRadius: 6 },
  performanceValue: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary, textAlign: "right" },
  reviewTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 12 },
  reviewCard: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, borderLeftWidth: 4 },
  reviewHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  reviewQNum: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold, color: Colors.textMuted },
  reviewQuestion: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginBottom: 6 },
  reviewAnswer: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, marginBottom: 4 },
  reviewExplanation: { fontSize: Fonts.sizes.xs, color: Colors.info, marginTop: 4, fontStyle: "italic" },
  retryBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, marginTop: 8, marginBottom: 32 },
  retryBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
});
