import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const UNIVERSITY_FORMULAS = [
  {
    id: "nust",
    name: "NUST",
    fullName: "National University of Sciences & Technology",
    color: "#EF4444",
    icon: "construct-outline",
    testName: "NET (NUST Entry Test)",
    formula: { matric: 10, inter: 10, entryTest: 80 },
    testMaxMarks: 200,
    programs: ["Engineering", "CS", "Business"],
    minMerit: 70,
    note: "NET carries 80% weight. Score high in NET!",
  },
  {
    id: "fast",
    name: "FAST-NUCES",
    fullName: "National University of Computer & Emerging Sciences",
    color: "#8B5CF6",
    icon: "code-slash-outline",
    testName: "NU Entry Test (FAST Test)",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    testMaxMarks: 100,
    programs: ["CS", "Software Engineering", "AI", "Electrical"],
    minMerit: 50,
    note: "Inter marks carry significant weight here.",
  },
  {
    id: "uet",
    name: "UET Lahore",
    fullName: "University of Engineering & Technology",
    color: "#10B981",
    icon: "settings-outline",
    testName: "ECAT (Engineering College Admission Test)",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    testMaxMarks: 400,
    programs: ["Civil", "Electrical", "Mechanical", "CS", "Chemical"],
    minMerit: 60,
    note: "ECAT is shared by most engineering universities in Punjab.",
  },
  {
    id: "ecat_general",
    name: "ECAT Universities",
    fullName: "Punjab Engineering Universities (General)",
    color: "#3B82F6",
    icon: "school-outline",
    testName: "ECAT (Engineering College Admission Test)",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    testMaxMarks: 400,
    programs: ["All Engineering Programs"],
    minMerit: 55,
    note: "Applies to UET, GIKI, UCP and other ECAT universities.",
  },
  {
    id: "mdcat",
    name: "MDCAT Universities",
    fullName: "Medical Universities (PMDC)",
    color: "#EF4444",
    icon: "medical-outline",
    testName: "MDCAT (Medical & Dental College Admission Test)",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    testMaxMarks: 200,
    programs: ["MBBS", "BDS", "Pharmacy"],
    minMerit: 65,
    note: "MDCAT is mandatory for all medical admissions in Pakistan.",
  },
  {
    id: "lums",
    name: "LUMS",
    fullName: "Lahore University of Management Sciences",
    color: "#F59E0B",
    icon: "business-outline",
    testName: "SAT / LUMS Test / A-Levels",
    formula: { matric: 0, inter: 0, entryTest: 0 },
    testMaxMarks: 1600,
    programs: ["Business", "CS", "Law", "Social Sciences"],
    minMerit: 0,
    note: "LUMS uses holistic admission: SAT scores, essays, interviews. No fixed formula.",
    customNote: true,
  },
  {
    id: "aga_khan",
    name: "Aga Khan University",
    fullName: "Aga Khan University (AKU)",
    color: "#EC4899",
    icon: "heart-outline",
    testName: "AKU Entry Test",
    formula: { matric: 0, inter: 50, entryTest: 50 },
    testMaxMarks: 100,
    programs: ["MBBS", "BScN", "Medicine"],
    minMerit: 75,
    note: "AKU has one of the most competitive admissions in Pakistan.",
  },
  {
    id: "giki",
    name: "GIKI",
    fullName: "Ghulam Ishaq Khan Institute",
    color: "#14B8A6",
    icon: "flash-outline",
    testName: "ECAT or SAT",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    testMaxMarks: 400,
    programs: ["Engineering", "CS", "Materials"],
    minMerit: 65,
    note: "GIKI accepts both ECAT and SAT scores.",
  },
  {
    id: "iba",
    name: "IBA Karachi",
    fullName: "Institute of Business Administration",
    color: "#6366F1",
    icon: "briefcase-outline",
    testName: "IBA Entry Test",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    testMaxMarks: 100,
    programs: ["BBA", "BS CS", "BS Economics"],
    minMerit: 70,
    note: "IBA is the most prestigious business school in Pakistan.",
  },
  {
    id: "nts_general",
    name: "NTS Based Admissions",
    fullName: "NTS (National Testing Service)",
    color: "#F59E0B",
    icon: "document-text-outline",
    testName: "NTS GAT / NAT",
    formula: { matric: 10, inter: 40, entryTest: 50 },
    testMaxMarks: 100,
    programs: ["Various Programs", "Government Jobs"],
    minMerit: 50,
    note: "Used by many universities and government departments.",
  },
];

export default function MeritCalculatorScreen() {
  const [selectedUni, setSelectedUni] = useState(null);
  const [matric, setMatric] = useState("");
  const [inter, setInter] = useState("");
  const [testScore, setTestScore] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    if (!selectedUni) return;
    if (selectedUni.customNote) {
      setResult({ custom: true });
      return;
    }
    if (!matric || !inter || !testScore) return;

    const matricPct = parseFloat(matric);
    const interPct = parseFloat(inter);
    const testPct = (parseFloat(testScore) / selectedUni.testMaxMarks) * 100;

    const { formula } = selectedUni;
    const aggregate =
      (matricPct * formula.matric / 100) +
      (interPct * formula.inter / 100) +
      (testPct * formula.entryTest / 100);

    const chance =
      aggregate >= selectedUni.minMerit + 10 ? "High" :
      aggregate >= selectedUni.minMerit ? "Moderate" :
      aggregate >= selectedUni.minMerit - 10 ? "Low" : "Very Low";

    setResult({
      aggregate: aggregate.toFixed(2),
      matricContrib: (matricPct * formula.matric / 100).toFixed(2),
      interContrib: (interPct * formula.inter / 100).toFixed(2),
      testContrib: (testPct * formula.entryTest / 100).toFixed(2),
      testPct: testPct.toFixed(2),
      chance,
      minMerit: selectedUni.minMerit,
    });
  }

  const chanceColor = result?.chance === "High" ? Colors.success :
    result?.chance === "Moderate" ? Colors.warning :
    result?.chance === "Low" ? Colors.error : Colors.error + "99";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Merit Calculator 📊</Text>
        <Text style={styles.headerSubtitle}>Calculate aggregate with university-specific formulas</Text>
      </View>

      <View style={styles.body}>
        {/* University Selection */}
        <Text style={styles.sectionTitle}>Select University / Exam</Text>
        {UNIVERSITY_FORMULAS.map(uni => (
          <TouchableOpacity
            key={uni.id}
            style={[styles.uniOption, selectedUni?.id === uni.id && { borderColor: uni.color, backgroundColor: uni.color + "08" }]}
            onPress={() => { setSelectedUni(uni); setResult(null); }}
          >
            <View style={[styles.uniOptionIcon, { backgroundColor: uni.color + "18" }]}>
              <Ionicons name={uni.icon} size={22} color={uni.color} />
            </View>
            <View style={styles.uniOptionInfo}>
              <Text style={styles.uniOptionName}>{uni.name}</Text>
              <Text style={styles.uniOptionTest}>{uni.testName}</Text>
              {!uni.customNote && (
                <Text style={styles.uniOptionFormula}>
                  Matric {uni.formula.matric}% + Inter {uni.formula.inter}% + Test {uni.formula.entryTest}%
                </Text>
              )}
            </View>
            {selectedUni?.id === uni.id && (
              <Ionicons name="checkmark-circle" size={22} color={uni.color} />
            )}
          </TouchableOpacity>
        ))}

        {/* Input Form */}
        {selectedUni && (
          <View style={styles.formCard}>
            <View style={[styles.formHeader, { backgroundColor: selectedUni.color }]}>
              <Text style={styles.formHeaderTitle}>{selectedUni.name} Merit Calculator</Text>
              <Text style={styles.formHeaderNote}>{selectedUni.note}</Text>
            </View>

            {selectedUni.customNote ? (
              <View style={styles.customNoteBox}>
                <Ionicons name="information-circle-outline" size={24} color={Colors.info} />
                <Text style={styles.customNoteText}>
                  {selectedUni.name} does not use a standard merit formula. Admission is based on holistic review including SAT scores, personal statements, recommendation letters, and interviews.
                  {"\n\n"}Visit {selectedUni.name}'s official website for current admission requirements.
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.formulaDisplay}>
                  <Text style={styles.formulaTitle}>Formula:</Text>
                  <View style={styles.formulaParts}>
                    {selectedUni.formula.matric > 0 && (
                      <View style={styles.formulaPart}>
                        <Text style={styles.formulaPartNum}>{selectedUni.formula.matric}%</Text>
                        <Text style={styles.formulaPartLabel}>Matric</Text>
                      </View>
                    )}
                    {selectedUni.formula.matric > 0 && <Text style={styles.formulaPlus}>+</Text>}
                    {selectedUni.formula.inter > 0 && (
                      <View style={styles.formulaPart}>
                        <Text style={styles.formulaPartNum}>{selectedUni.formula.inter}%</Text>
                        <Text style={styles.formulaPartLabel}>Inter/FSC</Text>
                      </View>
                    )}
                    {selectedUni.formula.inter > 0 && <Text style={styles.formulaPlus}>+</Text>}
                    <View style={styles.formulaPart}>
                      <Text style={[styles.formulaPartNum, { color: selectedUni.color }]}>{selectedUni.formula.entryTest}%</Text>
                      <Text style={styles.formulaPartLabel}>Entry Test</Text>
                    </View>
                  </View>
                </View>

                {selectedUni.formula.matric > 0 && (
                  <>
                    <Text style={styles.inputLabel}>Matric Marks (%)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 92.5"
                      keyboardType="numeric"
                      value={matric}
                      onChangeText={v => { setMatric(v); setResult(null); }}
                      placeholderTextColor={Colors.textMuted}
                    />
                  </>
                )}

                {selectedUni.formula.inter > 0 && (
                  <>
                    <Text style={styles.inputLabel}>Intermediate / FSC Marks (%)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 88.0"
                      keyboardType="numeric"
                      value={inter}
                      onChangeText={v => { setInter(v); setResult(null); }}
                      placeholderTextColor={Colors.textMuted}
                    />
                  </>
                )}

                <Text style={styles.inputLabel}>
                  {selectedUni.testName} Score (out of {selectedUni.testMaxMarks})
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={`e.g. ${Math.round(selectedUni.testMaxMarks * 0.75)}`}
                  keyboardType="numeric"
                  value={testScore}
                  onChangeText={v => { setTestScore(v); setResult(null); }}
                  placeholderTextColor={Colors.textMuted}
                />

                <TouchableOpacity
                  style={[styles.calcBtn, { backgroundColor: selectedUni.color }]}
                  onPress={calculate}
                >
                  <Ionicons name="calculator-outline" size={18} color={Colors.white} />
                  <Text style={styles.calcBtnText}>Calculate My Merit</Text>
                </TouchableOpacity>

                {result && !result.custom && (
                  <View style={styles.resultBox}>
                    <View style={[styles.aggregateDisplay, { borderColor: selectedUni.color }]}>
                      <Text style={[styles.aggregateNum, { color: selectedUni.color }]}>{result.aggregate}%</Text>
                      <Text style={styles.aggregateLabel}>Your Aggregate Merit</Text>
                    </View>

                    <View style={styles.breakdown}>
                      <Text style={styles.breakdownTitle}>Score Breakdown:</Text>
                      {selectedUni.formula.matric > 0 && (
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLabel}>Matric ({selectedUni.formula.matric}% weight)</Text>
                          <Text style={styles.breakdownValue}>{result.matricContrib}%</Text>
                        </View>
                      )}
                      {selectedUni.formula.inter > 0 && (
                        <View style={styles.breakdownRow}>
                          <Text style={styles.breakdownLabel}>Inter ({selectedUni.formula.inter}% weight)</Text>
                          <Text style={styles.breakdownValue}>{result.interContrib}%</Text>
                        </View>
                      )}
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Entry Test ({selectedUni.formula.entryTest}% weight)</Text>
                        <Text style={styles.breakdownValue}>{result.testContrib}%</Text>
                      </View>
                      <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Test Percentage</Text>
                        <Text style={styles.breakdownValue}>{result.testPct}%</Text>
                      </View>
                    </View>

                    <View style={[styles.chanceBox, { backgroundColor: chanceColor + "15", borderColor: chanceColor }]}>
                      <Text style={[styles.chanceTitle, { color: chanceColor }]}>
                        Admission Chance: {result.chance}
                      </Text>
                      <Text style={styles.chanceDesc}>
                        {result.chance === "High" ? `✅ Your merit (${result.aggregate}%) is well above minimum (${result.minMerit}%). Great chances!` :
                         result.chance === "Moderate" ? `⚠️ Your merit (${result.aggregate}%) is near minimum (${result.minMerit}%). You have a chance!` :
                         result.chance === "Low" ? `⚠️ Your merit (${result.aggregate}%) is below typical minimum (${result.minMerit}%). Try to improve your test score.` :
                         `❌ Your merit (${result.aggregate}%) is significantly below minimum (${result.minMerit}%). Focus on improving scores.`}
                      </Text>
                    </View>

                    <View style={styles.tipsBox}>
                      <Text style={styles.tipsTitle}>💡 How to improve your merit:</Text>
                      {selectedUni.formula.entryTest >= 50 && (
                        <Text style={styles.tip}>• Focus most on {selectedUni.testName} — it carries {selectedUni.formula.entryTest}% weight</Text>
                      )}
                      <Text style={styles.tip}>• Retake the entry test if possible — even 5% improvement helps a lot</Text>
                      <Text style={styles.tip}>• Apply to multiple universities with similar formulas</Text>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Info Cards */}
        <Text style={styles.sectionTitle}>Common Entry Test Info</Text>
        {[
          { name: "MDCAT", org: "PMDC", when: "September", score: "Out of 200", color: "#EF4444" },
          { name: "ECAT", org: "UET/ETEA", when: "August", score: "Out of 400", color: "#3B82F6" },
          { name: "NET (NUST)", org: "NUST", when: "July", score: "Out of 200", color: "#10B981" },
          { name: "FAST Test", org: "FAST-NUCES", when: "July-Aug", score: "Out of 100", color: "#8B5CF6" },
          { name: "NTS NAT", org: "NTS", when: "Multiple times", score: "Out of 100", color: "#F59E0B" },
        ].map((test, i) => (
          <View key={i} style={styles.testInfoCard}>
            <View style={[styles.testInfoDot, { backgroundColor: test.color }]} />
            <View style={styles.testInfoContent}>
              <Text style={styles.testInfoName}>{test.name}</Text>
              <Text style={styles.testInfoOrg}>By: {test.org}</Text>
            </View>
            <View style={styles.testInfoRight}>
              <Text style={styles.testInfoWhen}>{test.when}</Text>
              <Text style={styles.testInfoScore}>{test.score}</Text>
            </View>
          </View>
        ))}
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
  sectionTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 14, marginTop: 8 },
  uniOption: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: Colors.border, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  uniOptionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  uniOptionInfo: { flex: 1 },
  uniOptionName: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary },
  uniOptionTest: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 2 },
  uniOptionFormula: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.primary, marginTop: 3 },
  formCard: { backgroundColor: Colors.white, borderRadius: 20, overflow: "hidden", marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  formHeader: { padding: 16 },
  formHeaderTitle: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  formHeaderNote: { color: "rgba(255,255,255,0.85)", fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, marginTop: 4 },
  customNoteBox: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16 },
  customNoteText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 22 },
  formulaDisplay: { padding: 16, backgroundColor: Colors.background },
  formulaTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textSecondary, marginBottom: 10 },
  formulaParts: { flexDirection: "row", alignItems: "center", gap: 8 },
  formulaPart: { alignItems: "center", backgroundColor: Colors.white, borderRadius: 10, padding: 10, flex: 1 },
  formulaPartNum: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary },
  formulaPartLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  formulaPlus: { fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold, color: Colors.textMuted },
  inputLabel: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6, paddingHorizontal: 16 },
  input: { backgroundColor: Colors.background, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.md, color: Colors.textPrimary, marginBottom: 14, marginHorizontal: 16 },
  calcBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, margin: 16, borderRadius: 14, paddingVertical: 14 },
  calcBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  resultBox: { padding: 16, paddingTop: 0 },
  aggregateDisplay: { borderWidth: 3, borderRadius: 16, padding: 20, alignItems: "center", marginBottom: 16 },
  aggregateNum: { fontSize: 48, fontFamily: Fonts.bold },
  aggregateLabel: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginTop: 4 },
  breakdown: { backgroundColor: Colors.background, borderRadius: 12, padding: 14, marginBottom: 14 },
  breakdownTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 10 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
  breakdownLabel: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  breakdownValue: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  chanceBox: { borderRadius: 14, padding: 14, borderWidth: 1.5, marginBottom: 14 },
  chanceTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, marginBottom: 6 },
  chanceDesc: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  tipsBox: { backgroundColor: Colors.info + "10", borderRadius: 12, padding: 14 },
  tipsTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.info, marginBottom: 8 },
  tip: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginBottom: 4, lineHeight: 20 },
  testInfoCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10 },
  testInfoDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  testInfoContent: { flex: 1 },
  testInfoName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  testInfoOrg: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  testInfoRight: { alignItems: "flex-end" },
  testInfoWhen: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.primary },
  testInfoScore: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
});
