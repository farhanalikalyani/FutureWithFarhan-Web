import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Linking, Modal } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CITIES = ["All", "Islamabad", "Lahore", "Karachi", "Peshawar", "Quetta", "Faisalabad", "Multan"];
const SECTORS = ["All", "Public", "Private", "Semi-Government"];

const SAMPLE_UNIS = [
  {
    id: "nust", name: "NUST", fullName: "National University of Sciences & Technology",
    city: "Islamabad", sector: "Semi-Government", ranking: 1, color: "#EF4444",
    fee: 150000, hostelFee: 25000, admissionOpen: true, deadline: "Jul 30, 2025",
    merit: { engineering: 82, cs: 85, business: 78 },
    programs: ["BE Software", "BE Electrical", "BE Mechanical", "BS CS", "MBA", "MS"],
    faculties: ["SEECS", "SMME", "NUST Business School", "CAE"],
    website: "https://nust.edu.pk", hostel: true,
    description: "Pakistan's leading S&T university with world-class research facilities.",
    reviews: [
      { name: "Ahmed K", rating: 5, text: "Best university in Pakistan! Amazing faculty and facilities.", year: "2024" },
      { name: "Sara M", rating: 4, text: "Great environment for learning but fees are high.", year: "2023" },
    ],
    merits2024: { engineering: 84.5, cs: 87.2, business: 79.1 },
    merits2023: { engineering: 83.1, cs: 86.4, business: 78.5 },
    scholarships: ["NUST Need-Based Scholarship", "HEC Scholarship", "Merit Scholarship"],
    mapLocation: "H-12, Islamabad",
    entryTest: "NET (NUST Entry Test)",
  },
  {
    id: "lums", name: "LUMS", fullName: "Lahore University of Management Sciences",
    city: "Lahore", sector: "Private", ranking: 2, color: "#3B82F6",
    fee: 350000, hostelFee: 40000, admissionOpen: true, deadline: "Mar 15, 2025",
    merit: { business: 90, law: 88, cs: 87 },
    programs: ["BSc CS", "BSc Economics", "BSc Math", "LLB", "MBA", "MS"],
    faculties: ["SDSB", "SBASSE", "Shaikh Ahmad Hassan School of Law"],
    website: "https://lums.edu.pk", hostel: true,
    description: "Pakistan's premier business and social sciences university.",
    reviews: [
      { name: "Usman A", rating: 5, text: "World-class education and amazing alumni network!", year: "2024" },
      { name: "Hina B", rating: 4, text: "Expensive but worth every penny for the exposure.", year: "2023" },
    ],
    merits2024: { business: 91.2, law: 89.0, cs: 88.5 },
    merits2023: { business: 90.1, law: 88.2, cs: 87.3 },
    scholarships: ["LUMS National Outreach Program", "HEC Scholarship", "Need-Based Grant"],
    mapLocation: "DHA, Lahore",
    entryTest: "SAT / LSAT / LUMS Test",
  },
  {
    id: "fast", name: "FAST-NUCES", fullName: "National University of Computer & Emerging Sciences",
    city: "Islamabad", sector: "Private", ranking: 3, color: "#8B5CF6",
    fee: 120000, hostelFee: 20000, admissionOpen: true, deadline: "Aug 1, 2025",
    merit: { cs: 80, engineering: 78, business: 72 },
    programs: ["BS CS", "BS SE", "BS AI", "BE Electrical", "BBA", "MS CS"],
    faculties: ["Computer Science", "Electrical Engineering", "Business Administration"],
    website: "https://nu.edu.pk", hostel: true,
    description: "Top computer science university with campuses in 6 major cities.",
    reviews: [
      { name: "Bilal H", rating: 4, text: "Best CS university in Pakistan. Very practical education.", year: "2024" },
      { name: "Ayesha R", rating: 4, text: "Great faculty, good placement opportunities.", year: "2023" },
    ],
    merits2024: { cs: 81.5, engineering: 79.2, business: 73.0 },
    merits2023: { cs: 80.2, engineering: 77.8, business: 72.1 },
    scholarships: ["FAST Merit Scholarship", "HEC Need-Based", "Sports Scholarship"],
    mapLocation: "A.K. Brohi Road, Islamabad",
    entryTest: "FAST Entry Test (NU-FAST)",
  },
  {
    id: "uet", name: "UET Lahore", fullName: "University of Engineering & Technology",
    city: "Lahore", sector: "Public", ranking: 4, color: "#10B981",
    fee: 60000, hostelFee: 15000, admissionOpen: true, deadline: "Aug 20, 2025",
    merit: { engineering: 75, cs: 78, architecture: 70 },
    programs: ["BE Civil", "BE Electrical", "BE Mechanical", "BE CS", "BE Chemical", "BS Architecture"],
    faculties: ["Civil Engineering", "Electrical Engineering", "Mechanical", "CS & IT", "Architecture"],
    website: "https://uet.edu.pk", hostel: true,
    description: "Pakistan's oldest engineering university producing world-class engineers since 1921.",
    reviews: [
      { name: "Kamran S", rating: 4, text: "Excellent engineering education at affordable fee.", year: "2024" },
      { name: "Zara T", rating: 3, text: "Good university but infrastructure needs improvement.", year: "2023" },
    ],
    merits2024: { engineering: 76.5, cs: 79.1, architecture: 71.0 },
    merits2023: { engineering: 75.2, cs: 78.0, architecture: 70.5 },
    scholarships: ["UET Merit Scholarship", "HEC Scholarship", "Government Scholarship"],
    mapLocation: "GT Road, Lahore",
    entryTest: "ECAT (Engineering College Admission Test)",
  },
  {
    id: "pu", name: "University of Punjab", fullName: "University of the Punjab",
    city: "Lahore", sector: "Public", ranking: 5, color: "#F59E0B",
    fee: 30000, hostelFee: 10000, admissionOpen: false, deadline: "Closed",
    merit: { arts: 65, sciences: 70, commerce: 68 },
    programs: ["BS Physics", "BS Chemistry", "BS Math", "BCom", "MA English", "LLB", "BS IT"],
    faculties: ["Sciences", "Arts & Humanities", "Commerce", "Law", "Education", "IT"],
    website: "https://pu.edu.pk", hostel: true,
    description: "The oldest and largest university in Pakistan established in 1882.",
    reviews: [
      { name: "Nabeel A", rating: 3, text: "Good for arts students. Science labs could be better.", year: "2024" },
      { name: "Maria K", rating: 4, text: "Huge campus, diverse programs, affordable fees.", year: "2023" },
    ],
    merits2024: { arts: 66.0, sciences: 71.2, commerce: 69.0 },
    merits2023: { arts: 65.1, sciences: 70.5, commerce: 68.2 },
    scholarships: ["Punjab Government Scholarship", "HEC Scholarship", "Sports Scholarship"],
    mapLocation: "Canal Bank Road, Lahore",
    entryTest: "PU Entry Test",
  },
];

const HUB_SECTIONS = [
  { id: "explorer", label: "Explorer", icon: "business-outline", color: "#3B82F6" },
  { id: "merit", label: "Merit Calc", icon: "calculator-outline", color: "#10B981" },
  { id: "compare", label: "Compare", icon: "git-compare-outline", color: "#8B5CF6" },
  { id: "calendar", label: "Calendar", icon: "calendar-outline", color: "#F59E0B" },
  { id: "programs", label: "Programs", icon: "school-outline", color: "#EF4444" },
  { id: "merits", label: "Merit Lists", icon: "list-outline", color: "#EC4899" },
  { id: "scholarships", label: "Scholarships", icon: "ribbon-outline", color: "#14B8A6" },
  { id: "hostel", label: "Hostels", icon: "home-outline", color: "#6366F1" },
  { id: "fees", label: "Fee Calc", icon: "cash-outline", color: "#F59E0B" },
  { id: "reviews", label: "Reviews", icon: "star-outline", color: "#F5A623" },
  { id: "counselor", label: "AI Counselor", icon: "sparkles-outline", color: "#EF4444" },
];

// ─── Merit Calculator ─────────────────────────────────────
function MeritCalculator({ universities }) {
  const [matric, setMatric] = useState("");
  const [inter, setInter] = useState("");
  const [entryTest, setEntryTest] = useState("");
  const [program, setProgram] = useState("engineering");
  const [result, setResult] = useState(null);

  function calculate() {
    if (!matric || !inter || !entryTest) return;
    const merit = (parseFloat(matric) * 0.10) + (parseFloat(inter) * 0.40) + (parseFloat(entryTest) * 0.50);
    const eligible = universities.filter(u => u.merit?.[program] <= merit);
    setResult({ merit: merit.toFixed(2), eligible, program });
  }

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>📊 Merit Calculator & Admission Predictor</Text>
      <Text style={styles.sectionCardSubtitle}>Calculate your aggregate and see which universities you can get into</Text>

      <View style={styles.formulaBox}>
        <Text style={styles.formulaTitle}>Merit Formula:</Text>
        <Text style={styles.formulaText}>Matric (10%) + Inter (40%) + Entry Test (50%)</Text>
      </View>

      {[
        { label: "Matric Marks (%)", value: matric, set: setMatric, placeholder: "e.g. 92.5" },
        { label: "Intermediate Marks (%)", value: inter, set: setInter, placeholder: "e.g. 88.0" },
        { label: "Entry Test Score (%)", value: entryTest, set: setEntryTest, placeholder: "e.g. 76.0" },
      ].map((field, i) => (
        <View key={i}>
          <Text style={styles.inputLabel}>{field.label}</Text>
          <TextInput style={styles.calcInput} placeholder={field.placeholder} keyboardType="numeric" value={field.value} onChangeText={field.set} placeholderTextColor={Colors.textMuted} />
        </View>
      ))}

      <Text style={styles.inputLabel}>Program</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {["engineering", "cs", "business", "medical", "arts"].map(p => (
          <TouchableOpacity key={p} style={[styles.programChip, program === p && styles.programChipActive]} onPress={() => setProgram(p)}>
            <Text style={[styles.programChipText, program === p && styles.programChipTextActive]}>{p.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
        <Ionicons name="calculator-outline" size={18} color={Colors.white} />
        <Text style={styles.calcBtnText}>Calculate My Merit</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <View style={styles.meritScore}>
            <Text style={styles.meritScoreNum}>{result.merit}%</Text>
            <Text style={styles.meritScoreLabel}>Your Aggregate Merit</Text>
          </View>
          <Text style={styles.eligibleTitle}>Universities you can get into ({result.program.toUpperCase()}):</Text>
          {result.eligible.length === 0 ? (
            <Text style={styles.noEligible}>No universities matched. Try improving your scores!</Text>
          ) : result.eligible.map(u => (
            <View key={u.id} style={[styles.eligibleCard, { borderLeftColor: u.color }]}>
              <View style={[styles.eligibleDot, { backgroundColor: u.color }]} />
              <View style={styles.eligibleInfo}>
                <Text style={styles.eligibleName}>{u.name}</Text>
                <Text style={styles.eligibleMerit}>Required: {u.merit[result.program]}% | Your Merit: {result.merit}%</Text>
              </View>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── University Comparison ────────────────────────────────
function UniversityComparison({ universities }) {
  const [selected, setSelected] = useState([]);

  function toggleSelect(uni) {
    if (selected.find(u => u.id === uni.id)) {
      setSelected(selected.filter(u => u.id !== uni.id));
    } else if (selected.length < 3) {
      setSelected([...selected, uni]);
    }
  }

  const COMPARE_FIELDS = [
    { label: "City", key: "city", format: v => v },
    { label: "Sector", key: "sector", format: v => v },
    { label: "Ranking", key: "ranking", format: v => `#${v}` },
    { label: "Fee/Semester", key: "fee", format: v => `PKR ${(v/1000).toFixed(0)}K` },
    { label: "Hostel", key: "hostel", format: v => v ? "✅ Yes" : "❌ No" },
    { label: "Entry Test", key: "entryTest", format: v => v },
  ];

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>⚖️ University Comparison</Text>
      <Text style={styles.sectionCardSubtitle}>Select up to 3 universities to compare side by side</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {universities.map(uni => (
          <TouchableOpacity
            key={uni.id}
            style={[styles.selectUniBtn, selected.find(u => u.id === uni.id) && { backgroundColor: uni.color, borderColor: uni.color }]}
            onPress={() => toggleSelect(uni)}
          >
            <Text style={[styles.selectUniBtnText, selected.find(u => u.id === uni.id) && { color: Colors.white }]}>{uni.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selected.length >= 2 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.compareHeaderRow}>
              <View style={styles.compareFieldCol}><Text style={styles.compareFieldLabel}>Feature</Text></View>
              {selected.map(uni => (
                <View key={uni.id} style={[styles.compareUniCol, { backgroundColor: uni.color }]}>
                  <Text style={styles.compareUniName}>{uni.name}</Text>
                </View>
              ))}
            </View>
            {COMPARE_FIELDS.map((field, i) => (
              <View key={i} style={[styles.compareRow, i % 2 === 0 && { backgroundColor: Colors.background }]}>
                <View style={styles.compareFieldCol}><Text style={styles.compareFieldText}>{field.label}</Text></View>
                {selected.map(uni => (
                  <View key={uni.id} style={styles.compareUniCol}>
                    <Text style={styles.compareValue}>{field.format(uni[field.key])}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.compareHint}>
          <Ionicons name="git-compare-outline" size={40} color={Colors.textMuted} />
          <Text style={styles.compareHintText}>Select at least 2 universities to compare</Text>
        </View>
      )}
    </View>
  );
}

// ─── Admission Calendar ───────────────────────────────────
function AdmissionCalendar({ universities }) {
  const events = universities.flatMap(u => [
    { uni: u.name, event: "Admission Deadline", date: u.deadline, color: u.color, open: u.admissionOpen },
  ]).filter(e => e.date !== "Closed");

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>📅 Admission Calendar 2025</Text>
      <Text style={styles.sectionCardSubtitle}>Important dates for university admissions</Text>
      {events.map((event, i) => (
        <View key={i} style={[styles.calendarEvent, { borderLeftColor: event.color }]}>
          <View style={styles.calendarEventLeft}>
            <View style={[styles.calendarDot, { backgroundColor: event.color }]} />
            <View style={styles.calendarInfo}>
              <Text style={styles.calendarUni}>{event.uni}</Text>
              <Text style={styles.calendarEvent2}>{event.event}</Text>
            </View>
          </View>
          <View style={styles.calendarRight}>
            <Text style={styles.calendarDate}>{event.date}</Text>
            {event.open ? (
              <Text style={styles.openStatus}>🟢 Open</Text>
            ) : (
              <Text style={styles.closedStatus}>🔴 Closed</Text>
            )}
          </View>
        </View>
      ))}
      <View style={styles.importantDates}>
        <Text style={styles.importantDatesTitle}>📌 Key Dates 2025</Text>
        {[
          { event: "ECAT Registration Opens", date: "June 1, 2025" },
          { event: "MDCAT Registration Opens", date: "June 15, 2025" },
          { event: "ECAT Exam", date: "August 10, 2025" },
          { event: "MDCAT Exam", date: "September 14, 2025" },
          { event: "FAST Entry Test", date: "July 20, 2025" },
          { event: "NET (NUST) Test", date: "July 15, 2025" },
          { event: "Punjab Universities Merit Lists", date: "September 2025" },
        ].map((d, i) => (
          <View key={i} style={styles.importantDate}>
            <Ionicons name="calendar-outline" size={14} color={Colors.primary} />
            <Text style={styles.importantDateEvent}>{d.event}</Text>
            <Text style={styles.importantDateValue}>{d.date}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Program Finder ───────────────────────────────────────
function ProgramFinder({ universities }) {
  const [interest, setInterest] = useState("engineering");
  const INTERESTS = ["engineering", "cs", "medical", "business", "arts", "law"];

  const matches = universities.filter(u =>
    u.programs.some(p => p.toLowerCase().includes(interest.toLowerCase()) ||
      (interest === "cs" && (p.includes("CS") || p.includes("Software") || p.includes("IT"))) ||
      (interest === "engineering" && (p.includes("BE") || p.includes("Engineering"))) ||
      (interest === "business" && (p.includes("BBA") || p.includes("MBA") || p.includes("Business"))) ||
      (interest === "medical" && (p.includes("MBBS") || p.includes("BDS") || p.includes("Medicine"))) ||
      (interest === "law" && p.includes("LLB")) ||
      (interest === "arts" && (p.includes("MA") || p.includes("Arts") || p.includes("English")))
    )
  );

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>🎯 Program Finder</Text>
      <Text style={styles.sectionCardSubtitle}>Find universities offering your desired program</Text>
      <Text style={styles.inputLabel}>I'm interested in:</Text>
      <View style={styles.interestGrid}>
        {INTERESTS.map(i => (
          <TouchableOpacity key={i} style={[styles.interestBtn, interest === i && styles.interestBtnActive]} onPress={() => setInterest(i)}>
            <Text style={[styles.interestBtnText, interest === i && styles.interestBtnTextActive]}>{i.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.matchTitle}>{matches.length} universities found for {interest.toUpperCase()}:</Text>
      {matches.map(uni => (
        <View key={uni.id} style={[styles.matchCard, { borderLeftColor: uni.color }]}>
          <View style={[styles.matchInitials, { backgroundColor: uni.color }]}>
            <Text style={styles.matchInitialsText}>{uni.name[0]}</Text>
          </View>
          <View style={styles.matchInfo}>
            <Text style={styles.matchName}>{uni.name}</Text>
            <Text style={styles.matchPrograms} numberOfLines={1}>
              {uni.programs.filter(p =>
                p.toLowerCase().includes(interest) ||
                (interest === "cs" && (p.includes("CS") || p.includes("Software"))) ||
                (interest === "engineering" && (p.includes("BE") || p.includes("Engineering"))) ||
                (interest === "business" && (p.includes("BBA") || p.includes("MBA")))
              ).join(", ")}
            </Text>
            <Text style={styles.matchCity}>{uni.city} • {uni.sector}</Text>
          </View>
          <Text style={[styles.matchRank, { color: uni.color }]}>#{uni.ranking}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Merit Lists ──────────────────────────────────────────
function MeritLists({ universities }) {
  const [selectedUni, setSelectedUni] = useState(universities[0]);
  const [year, setYear] = useState("2024");

  const meritData = year === "2024" ? selectedUni?.merits2024 : selectedUni?.merits2023;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>📝 Merit Lists</Text>
      <Text style={styles.sectionCardSubtitle}>Previous years' closing merits by program</Text>

      <Text style={styles.inputLabel}>Select University</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {universities.map(uni => (
          <TouchableOpacity key={uni.id} style={[styles.uniSelectBtn, selectedUni?.id === uni.id && { backgroundColor: uni.color, borderColor: uni.color }]} onPress={() => setSelectedUni(uni)}>
            <Text style={[styles.uniSelectBtnText, selectedUni?.id === uni.id && { color: Colors.white }]}>{uni.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.yearRow}>
        {["2024", "2023"].map(y => (
          <TouchableOpacity key={y} style={[styles.yearBtn, year === y && styles.yearBtnActive]} onPress={() => setYear(y)}>
            <Text style={[styles.yearBtnText, year === y && styles.yearBtnTextActive]}>{y}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedUni && meritData && (
        <View style={styles.meritTable}>
          <View style={styles.meritTableHeader}>
            <Text style={styles.meritTableHeaderText}>Program</Text>
            <Text style={styles.meritTableHeaderText}>Closing Merit</Text>
            <Text style={styles.meritTableHeaderText}>Status</Text>
          </View>
          {Object.entries(meritData).map(([program, merit], i) => (
            <View key={i} style={[styles.meritTableRow, i % 2 === 0 && { backgroundColor: Colors.background }]}>
              <Text style={styles.meritTableProgram}>{program.toUpperCase()}</Text>
              <Text style={styles.meritTableMerit}>{merit}%</Text>
              <View style={[styles.meritStatusBadge, { backgroundColor: merit >= 85 ? Colors.error + "20" : merit >= 75 ? Colors.warning + "20" : Colors.success + "20" }]}>
                <Text style={[styles.meritStatusText, { color: merit >= 85 ? Colors.error : merit >= 75 ? Colors.warning : Colors.success }]}>
                  {merit >= 85 ? "Competitive" : merit >= 75 ? "Moderate" : "Accessible"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Scholarships by University ───────────────────────────
function UniversityScholarships({ universities }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>🎓 Scholarships by University</Text>
      <Text style={styles.sectionCardSubtitle}>Financial aid available at each university</Text>
      {universities.map(uni => (
        <View key={uni.id} style={styles.scholarshipUniCard}>
          <View style={[styles.scholarshipUniHeader, { backgroundColor: uni.color }]}>
            <Text style={styles.scholarshipUniName}>{uni.name}</Text>
            <Text style={styles.scholarshipUniCount}>{uni.scholarships?.length} scholarships</Text>
          </View>
          <View style={styles.scholarshipList}>
            {uni.scholarships?.map((s, i) => (
              <View key={i} style={styles.scholarshipItem}>
                <Ionicons name="ribbon-outline" size={14} color={uni.color} />
                <Text style={styles.scholarshipItemText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

// ─── Hostel Information ───────────────────────────────────
function HostelInfo({ universities }) {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>🏠 Hostel Information</Text>
      <Text style={styles.sectionCardSubtitle}>On-campus accommodation details</Text>
      {universities.map(uni => (
        <View key={uni.id} style={styles.hostelCard}>
          <View style={styles.hostelHeader}>
            <View style={[styles.hostelInitials, { backgroundColor: uni.color }]}>
              <Text style={styles.hostelInitialsText}>{uni.name[0]}</Text>
            </View>
            <View style={styles.hostelInfo}>
              <Text style={styles.hostelUniName}>{uni.name}</Text>
              <Text style={styles.hostelCity}>{uni.city}</Text>
            </View>
            {uni.hostel ? (
              <View style={styles.hostelAvailable}>
                <Text style={styles.hostelAvailableText}>✅ Available</Text>
              </View>
            ) : (
              <View style={styles.hostelNotAvailable}>
                <Text style={styles.hostelNotAvailableText}>❌ Not Available</Text>
              </View>
            )}
          </View>
          {uni.hostel && (
            <View style={styles.hostelDetails}>
              <View style={styles.hostelDetailItem}>
                <Ionicons name="cash-outline" size={14} color={Colors.success} />
                <Text style={styles.hostelDetailText}>Fee: PKR {(uni.hostelFee/1000).toFixed(0)}K/semester</Text>
              </View>
              <View style={styles.hostelDetailItem}>
                <Ionicons name="location-outline" size={14} color={Colors.primary} />
                <Text style={styles.hostelDetailText}>{uni.mapLocation}</Text>
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Fee Calculator ───────────────────────────────────────
function FeeCalculator({ universities }) {
  const [selectedUni, setSelectedUni] = useState(universities[0]);
  const [semesters, setSemesters] = useState("8");
  const [includeHostel, setIncludeHostel] = useState(false);

  const totalFee = selectedUni ? (
    (selectedUni.fee * parseInt(semesters || 0)) +
    (includeHostel && selectedUni.hostel ? selectedUni.hostelFee * parseInt(semesters || 0) : 0)
  ) : 0;

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>💰 Fee Calculator</Text>
      <Text style={styles.sectionCardSubtitle}>Estimate total cost of your education</Text>

      <Text style={styles.inputLabel}>Select University</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {universities.map(uni => (
          <TouchableOpacity key={uni.id} style={[styles.uniSelectBtn, selectedUni?.id === uni.id && { backgroundColor: uni.color, borderColor: uni.color }]} onPress={() => setSelectedUni(uni)}>
            <Text style={[styles.uniSelectBtnText, selectedUni?.id === uni.id && { color: Colors.white }]}>{uni.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.inputLabel}>Number of Semesters</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {["4", "6", "8", "10"].map(s => (
          <TouchableOpacity key={s} style={[styles.semesterBtn, semesters === s && styles.semesterBtnActive]} onPress={() => setSemesters(s)}>
            <Text style={[styles.semesterBtnText, semesters === s && styles.semesterBtnTextActive]}>{s} sem</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.hostelToggle} onPress={() => setIncludeHostel(!includeHostel)}>
        <View style={[styles.toggleBox, includeHostel && styles.toggleBoxActive]}>
          {includeHostel && <Ionicons name="checkmark" size={14} color={Colors.white} />}
        </View>
        <Text style={styles.hostelToggleText}>Include Hostel Fee</Text>
      </TouchableOpacity>

      {selectedUni && (
        <View style={styles.feeBreakdown}>
          <Text style={styles.feeBreakdownTitle}>Cost Breakdown</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Tuition Fee/Semester</Text>
            <Text style={styles.feeValue}>PKR {selectedUni.fee.toLocaleString()}</Text>
          </View>
          {includeHostel && selectedUni.hostel && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Hostel Fee/Semester</Text>
              <Text style={styles.feeValue}>PKR {selectedUni.hostelFee.toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Total Semesters</Text>
            <Text style={styles.feeValue}>{semesters}</Text>
          </View>
          <View style={[styles.feeRow, styles.feeTotalRow]}>
            <Text style={styles.feeTotalLabel}>Total Estimated Cost</Text>
            <Text style={styles.feeTotalValue}>PKR {totalFee.toLocaleString()}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Student Reviews ──────────────────────────────────────
function StudentReviews({ universities }) {
  const [selectedUni, setSelectedUni] = useState(universities[0]);

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons key={i} name={i < rating ? "star" : "star-outline"} size={14} color={Colors.gold} />
    ));
  }

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>⭐ Student Reviews</Text>
      <Text style={styles.sectionCardSubtitle}>Hear from real students about their experience</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        {universities.map(uni => (
          <TouchableOpacity key={uni.id} style={[styles.uniSelectBtn, selectedUni?.id === uni.id && { backgroundColor: uni.color, borderColor: uni.color }]} onPress={() => setSelectedUni(uni)}>
            <Text style={[styles.uniSelectBtnText, selectedUni?.id === uni.id && { color: Colors.white }]}>{uni.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedUni?.reviews?.map((review, i) => (
        <View key={i} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewAvatar}>
              <Text style={styles.reviewAvatarText}>{review.name[0]}</Text>
            </View>
            <View style={styles.reviewInfo}>
              <Text style={styles.reviewName}>{review.name}</Text>
              <Text style={styles.reviewYear}>Class of {review.year}</Text>
            </View>
            <View style={styles.reviewStars}>
              {renderStars(review.rating)}
            </View>
          </View>
          <Text style={styles.reviewText}>{review.text}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── AI Admission Counselor ───────────────────────────────
function AIAdmissionCounselor() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Assalam o Alaikum! 🎓 I'm your AI Admission Counselor. I can help you with:\n\n• Choosing the right university\n• Understanding admission requirements\n• Merit calculation help\n• Scholarship guidance\n• Program selection\n\nWhat would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const QUICK_QUESTIONS = [
    "Which university is best for CS?",
    "How to calculate aggregate merit?",
    "What is the fee structure of NUST?",
    "How to get scholarship in Pakistan?",
  ];

  async function sendMessage(text) {
    const userText = text || input.trim();
    if (!userText) return;
    const userMsg = { role: "user", text: userText };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "YOUR_CLAUDE_API_KEY",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 800,
          system: "You are an expert AI Admission Counselor for Pakistani universities. Help students with university selection, merit calculation, admission process, scholarships, and program choices. Be concise, practical and encouraging. Focus on Pakistani universities like NUST, LUMS, FAST, UET, Punjab University, etc.",
          messages: updated.map(m => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await response.json();
      const aiText = data.content?.[0]?.text || "Sorry, I couldn't respond. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", text: aiText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, connection failed. Please check your internet." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionCardTitle}>🤖 AI Admission Counselor</Text>
      <Text style={styles.sectionCardSubtitle}>Get personalized university guidance powered by AI</Text>
      <View style={styles.chatContainer}>
        <ScrollView style={styles.chatMessages} showsVerticalScrollIndicator={false}>
          {messages.map((msg, i) => (
            <View key={i} style={[styles.chatBubble, msg.role === "user" ? styles.chatBubbleUser : styles.chatBubbleAI]}>
              <Text style={[styles.chatBubbleText, msg.role === "user" && styles.chatBubbleTextUser]}>{msg.text}</Text>
            </View>
          ))}
          {loading && (
            <View style={styles.chatBubbleAI}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          )}
        </ScrollView>
        <View style={styles.quickQuestions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {QUICK_QUESTIONS.map((q, i) => (
              <TouchableOpacity key={i} style={styles.quickQ} onPress={() => sendMessage(q)}>
                <Text style={styles.quickQText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.chatInputRow}>
          <TextInput style={styles.chatInput} placeholder="Ask about admissions..." value={input} onChangeText={setInput} placeholderTextColor={Colors.textMuted} />
          <TouchableOpacity style={[styles.chatSendBtn, (!input.trim() || loading) && styles.chatSendBtnDisabled]} onPress={() => sendMessage()} disabled={!input.trim() || loading}>
            <Ionicons name="send" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────
export default function UniversitiesScreen() {
  const [universities, setUniversities] = useState(SAMPLE_UNIS);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("explorer");
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("All");
  const [sector, setSector] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState("overview");

  useEffect(() => { loadUniversities(); }, []);

  async function loadUniversities() {
    setLoading(false);
    try {
      const snapshot = await getDocs(query(collection(db, "universities"), orderBy("ranking")));
      const dbUnis = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (dbUnis.length > 0) setUniversities(dbUnis);
    } catch (e) { console.log(e); }
  }

  const filtered = universities.filter(u => {
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.city?.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === "All" || u.city === city;
    const matchSector = sector === "All" || u.sector === sector;
    return matchSearch && matchCity && matchSector;
  });

  const programs = (u) => Array.isArray(u.programs) ? u.programs : (u.programs || "").split(",").map(p => p.trim()).filter(Boolean);
  const faculties = (u) => Array.isArray(u.faculties) ? u.faculties : (u.faculties || "").split(",").map(f => f.trim()).filter(Boolean);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>University Hub 🎓</Text>
        <Text style={styles.headerSubtitle}>Your complete university guide</Text>
        <View style={styles.headerStats}>
          {[
            { label: "Universities", value: universities.length },
            { label: "Programs", value: "500+" },
            { label: "Scholarships", value: "50+" },
          ].map((s, i) => (
            <View key={i} style={styles.headerStat}>
              <Text style={styles.headerStatValue}>{s.value}</Text>
              <Text style={styles.headerStatLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sectionsScroll} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10 }}>
        {HUB_SECTIONS.map(section => (
          <TouchableOpacity
            key={section.id}
            style={[styles.sectionBtn, activeSection === section.id && { backgroundColor: section.color }]}
            onPress={() => setActiveSection(section.id)}
          >
            <Ionicons name={section.icon} size={16} color={activeSection === section.id ? Colors.white : section.color} />
            <Text style={[styles.sectionBtnText, activeSection === section.id && { color: Colors.white }]}>{section.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

        {/* Explorer */}
        {activeSection === "explorer" && (
          <View>
            <View style={styles.searchRow}>
              <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
              <TextInput style={styles.searchInput} placeholder="Search universities..." value={search} onChangeText={setSearch} placeholderTextColor={Colors.textMuted} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {CITIES.map(c => (
                <TouchableOpacity key={c} style={[styles.filterChip, city === c && styles.filterChipActive]} onPress={() => setCity(c)}>
                  <Text style={[styles.filterText, city === c && styles.filterTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
              {SECTORS.map(s => (
                <TouchableOpacity key={s} style={[styles.filterChip, sector === s && styles.filterChipActive]} onPress={() => setSector(s)}>
                  <Text style={[styles.filterText, sector === s && styles.filterTextActive]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {loading ? <ActivityIndicator color={Colors.primary} size="large" style={{ marginTop: 40 }} /> : (
              filtered.map(uni => (
                <TouchableOpacity key={uni.id} style={styles.uniCard} onPress={() => { setSelected(uni); setActiveDetailTab("overview"); setShowDetail(true); }} activeOpacity={0.8}>
                  <View style={[styles.uniCardHeader, { backgroundColor: uni.color || Colors.primary }]}>
                    <View style={styles.uniCardLeft}>
                      <View style={styles.uniInitials}>
                        <Text style={styles.uniInitialsText}>{uni.name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "U"}</Text>
                      </View>
                      <View style={styles.uniCardInfo}>
                        <Text style={styles.uniCardName} numberOfLines={1}>{uni.name}</Text>
                        <Text style={styles.uniCardCity}>📍 {uni.city} • {uni.sector}</Text>
                      </View>
                    </View>
                    <View style={styles.rankBadge}><Text style={styles.rankText}>#{uni.ranking}</Text></View>
                  </View>
                  <View style={styles.uniCardBody}>
                    <View style={styles.uniCardRow}>
                      {uni.admissionOpen ? (
                        <View style={styles.openBadge}><Text style={styles.openText}>🟢 Open</Text></View>
                      ) : (
                        <View style={styles.closedBadge}><Text style={styles.closedText}>🔴 Closed</Text></View>
                      )}
                      <Text style={styles.deadlineText}>📅 {uni.deadline}</Text>
                    </View>
                    <Text style={styles.uniCardDesc} numberOfLines={2}>{uni.description}</Text>
                    <View style={styles.uniCardStats}>
                      <Text style={styles.uniCardStat}>💰 PKR {(uni.fee/1000).toFixed(0)}K/sem</Text>
                      <Text style={styles.uniCardStat}>🏠 {uni.hostel ? "Hostel ✅" : "No Hostel"}</Text>
                    </View>
                    <TouchableOpacity style={[styles.viewDetailBtn, { backgroundColor: uni.color || Colors.primary }]} onPress={() => { setSelected(uni); setShowDetail(true); }}>
                      <Text style={styles.viewDetailBtnText}>View Full Profile</Text>
                      <Ionicons name="arrow-forward" size={14} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {activeSection === "merit" && <MeritCalculator universities={universities} />}
        {activeSection === "compare" && <UniversityComparison universities={universities} />}
        {activeSection === "calendar" && <AdmissionCalendar universities={universities} />}
        {activeSection === "programs" && <ProgramFinder universities={universities} />}
        {activeSection === "merits" && <MeritLists universities={universities} />}
        {activeSection === "scholarships" && <UniversityScholarships universities={universities} />}
        {activeSection === "hostel" && <HostelInfo universities={universities} />}
        {activeSection === "fees" && <FeeCalculator universities={universities} />}
        {activeSection === "reviews" && <StudentReviews universities={universities} />}
        {activeSection === "counselor" && <AIAdmissionCounselor />}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={showDetail} animationType="slide">
        {selected && (
          <View style={styles.detailContainer}>
            <View style={[styles.detailHeader, { backgroundColor: selected.color || Colors.primary }]}>
              <TouchableOpacity onPress={() => setShowDetail(false)} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <View style={styles.detailInitials}>
                <Text style={styles.detailInitialsText}>{selected.name?.split(" ").map(w => w[0]).join("").slice(0, 2) || "U"}</Text>
              </View>
              <Text style={styles.detailName}>{selected.fullName || selected.name}</Text>
              <Text style={styles.detailCity}>📍 {selected.city} • {selected.sector}</Text>
              {selected.admissionOpen ? (
                <View style={styles.openBadgeLg}><Text style={styles.openBadgeLgText}>🟢 Admissions Open</Text></View>
              ) : (
                <View style={styles.closedBadgeLg}><Text style={styles.closedBadgeLgText}>🔴 Admissions Closed</Text></View>
              )}
            </View>

            <View style={styles.detailTabs}>
              {["overview", "programs", "admission", "facilities"].map(tab => (
                <TouchableOpacity key={tab} style={[styles.detailTab, activeDetailTab === tab && styles.detailTabActive]} onPress={() => setActiveDetailTab(tab)}>
                  <Text style={[styles.detailTabText, activeDetailTab === tab && styles.detailTabTextActive]}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
              {activeDetailTab === "overview" && (
                <View>
                  <Text style={styles.aboutText}>{selected.description}</Text>
                  {[
                    { icon: "trophy-outline", label: "National Ranking", value: `#${selected.ranking}`, color: Colors.gold },
                    { icon: "cash-outline", label: "Tuition Fee", value: `PKR ${selected.fee?.toLocaleString()}/semester`, color: Colors.success },
                    { icon: "home-outline", label: "Hostel Fee", value: selected.hostel ? `PKR ${selected.hostelFee?.toLocaleString()}/semester` : "Not Available", color: Colors.info },
                    { icon: "time-outline", label: "Deadline", value: selected.deadline, color: Colors.error },
                    { icon: "star-outline", label: "Entry Test", value: selected.entryTest || "Check website", color: Colors.primary },
                  ].map((item, i) => (
                    <View key={i} style={styles.infoRow}>
                      <View style={[styles.infoIcon, { backgroundColor: item.color + "18" }]}>
                        <Ionicons name={item.icon} size={18} color={item.color} />
                      </View>
                      <View>
                        <Text style={styles.infoLabel}>{item.label}</Text>
                        <Text style={styles.infoValue}>{item.value}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {activeDetailTab === "programs" && (
                <View>
                  <Text style={styles.detailSectionTitle}>Degree Programs</Text>
                  {programs(selected).map((p, i) => (
                    <View key={i} style={styles.programItem}>
                      <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                      <Text style={styles.programItemText}>{p}</Text>
                    </View>
                  ))}
                  <Text style={styles.detailSectionTitle}>Faculties</Text>
                  {faculties(selected).map((f, i) => (
                    <View key={i} style={styles.facultyItem}>
                      <Ionicons name="school-outline" size={16} color={Colors.primary} />
                      <Text style={styles.facultyText}>{f}</Text>
                    </View>
                  ))}
                  {selected.merits2024 && (
                    <>
                      <Text style={styles.detailSectionTitle}>2024 Closing Merits</Text>
                      {Object.entries(selected.merits2024).map(([prog, merit], i) => (
                        <View key={i} style={styles.meritRow}>
                          <Text style={styles.meritRowProg}>{prog.toUpperCase()}</Text>
                          <Text style={styles.meritRowValue}>{merit}%</Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              )}

              {activeDetailTab === "admission" && (
                <View>
                  <View style={[styles.admissionStatus, { backgroundColor: selected.admissionOpen ? Colors.success + "15" : Colors.error + "15", borderColor: selected.admissionOpen ? Colors.success : Colors.error }]}>
                    <Ionicons name={selected.admissionOpen ? "checkmark-circle" : "close-circle"} size={32} color={selected.admissionOpen ? Colors.success : Colors.error} />
                    <Text style={[styles.admissionStatusText, { color: selected.admissionOpen ? Colors.success : Colors.error }]}>
                      Admissions are {selected.admissionOpen ? "OPEN" : "CLOSED"}
                    </Text>
                    <Text style={styles.admissionDeadline}>Deadline: {selected.deadline}</Text>
                  </View>
                  <Text style={styles.detailSectionTitle}>How to Apply</Text>
                  {["Visit official website", "Fill online application", "Upload documents", "Pay application fee", "Appear for entry test", "Check merit list"].map((step, i) => (
                    <View key={i} style={styles.stepItem}>
                      <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                  {selected.scholarships && (
                    <>
                      <Text style={styles.detailSectionTitle}>Available Scholarships</Text>
                      {selected.scholarships.map((s, i) => (
                        <View key={i} style={styles.scholarItem}>
                          <Ionicons name="ribbon-outline" size={16} color={Colors.gold} />
                          <Text style={styles.scholarText}>{s}</Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              )}

              {activeDetailTab === "facilities" && (
                <View>
                  {[
                    { icon: "home-outline", label: "Hostel", available: selected.hostel },
                    { icon: "library-outline", label: "Library", available: true },
                    { icon: "wifi-outline", label: "WiFi", available: true },
                    { icon: "cafe-outline", label: "Cafeteria", available: true },
                    { icon: "fitness-outline", label: "Sports Complex", available: true },
                    { icon: "medical-outline", label: "Medical Center", available: true },
                    { icon: "car-outline", label: "Transport", available: true },
                    { icon: "people-outline", label: "Student Societies", available: true },
                  ].map((f, i) => (
                    <View key={i} style={styles.facilityRow}>
                      <Ionicons name={f.icon} size={20} color={f.available ? Colors.success : Colors.textMuted} />
                      <Text style={styles.facilityText}>{f.label}</Text>
                      <Text style={{ color: f.available ? Colors.success : Colors.error, fontSize: Fonts.sizes.xs }}>
                        {f.available ? "✅ Available" : "❌ N/A"}
                      </Text>
                    </View>
                  ))}
                  {selected.reviews && (
                    <>
                      <Text style={styles.detailSectionTitle}>Student Reviews</Text>
                      {selected.reviews.map((r, i) => (
                        <View key={i} style={styles.reviewCard}>
                          <View style={styles.reviewHeader}>
                            <View style={styles.reviewAvatar}>
                              <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                            </View>
                            <View>
                              <Text style={styles.reviewName}>{r.name}</Text>
                              <Text style={styles.reviewYear}>Class of {r.year}</Text>
                            </View>
                            <View style={styles.stars}>
                              {Array.from({ length: 5 }, (_, idx) => (
                                <Ionicons key={idx} name={idx < r.rating ? "star" : "star-outline"} size={12} color={Colors.gold} />
                              ))}
                            </View>
                          </View>
                          <Text style={styles.reviewText}>{r.text}</Text>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              )}

              {selected.website && (
                <TouchableOpacity style={[styles.websiteBtn, { backgroundColor: selected.color || Colors.primary }]} onPress={() => Linking.openURL(selected.website)}>
                  <Ionicons name="globe-outline" size={18} color={Colors.white} />
                  <Text style={styles.websiteBtnText}>Visit Official Website</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primary, paddingTop: 56, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { color: Colors.white, fontSize: Fonts.sizes.xxl, fontFamily: Fonts.bold },
  headerSubtitle: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 4 },
  headerStats: { flexDirection: "row", gap: 16, marginTop: 16 },
  headerStat: { flex: 1, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 10, alignItems: "center" },
  headerStatValue: { color: Colors.white, fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  headerStatLabel: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.xs, marginTop: 2 },
  sectionsScroll: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border, maxHeight: 60 },
  sectionBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.background, marginRight: 8, borderWidth: 1, borderColor: Colors.border },
  sectionBtnText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  content: { flex: 1 },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 12, height: 46, marginBottom: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  filterTextActive: { color: Colors.white },
  uniCard: { backgroundColor: Colors.white, borderRadius: 20, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4, overflow: "hidden" },
  uniCardHeader: { padding: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  uniCardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  uniInitials: { width: 46, height: 46, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginRight: 10 },
  uniInitialsText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  uniCardInfo: { flex: 1 },
  uniCardName: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  uniCardCity: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.xs, marginTop: 2 },
  rankBadge: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  rankText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  uniCardBody: { padding: 14 },
  uniCardRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  openBadge: { backgroundColor: Colors.success + "15", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  openText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.success },
  closedBadge: { backgroundColor: Colors.error + "15", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  closedText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.error },
  deadlineText: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  uniCardDesc: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 18, marginBottom: 8 },
  uniCardStats: { flexDirection: "row", gap: 16, marginBottom: 12 },
  uniCardStat: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  viewDetailBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 10, paddingVertical: 10 },
  viewDetailBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  sectionCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 18, marginBottom: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  sectionCardTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 6 },
  sectionCardSubtitle: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginBottom: 16 },
  formulaBox: { backgroundColor: Colors.primary + "10", borderRadius: 10, padding: 12, marginBottom: 16 },
  formulaTitle: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.primary },
  formulaText: { fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginTop: 4 },
  inputLabel: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary, marginBottom: 6 },
  calcInput: { backgroundColor: Colors.background, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 14, paddingVertical: 10, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, marginBottom: 14 },
  programChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  programChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  programChipText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  programChipTextActive: { color: Colors.white },
  calcBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 12, marginBottom: 16 },
  calcBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  resultBox: { backgroundColor: Colors.background, borderRadius: 14, padding: 14 },
  meritScore: { alignItems: "center", paddingVertical: 16 },
  meritScoreNum: { fontSize: 40, fontFamily: Fonts.bold, color: Colors.primary },
  meritScoreLabel: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginTop: 4 },
  eligibleTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginBottom: 10 },
  noEligible: { fontSize: Fonts.sizes.sm, color: Colors.error, textAlign: "center", paddingVertical: 10 },
  eligibleCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 10, padding: 12, marginBottom: 8, borderLeftWidth: 4 },
  eligibleDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  eligibleInfo: { flex: 1 },
  eligibleName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  eligibleMerit: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  selectUniBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8, backgroundColor: Colors.background },
  selectUniBtnText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  compareHeaderRow: { flexDirection: "row" },
  compareFieldCol: { width: 120, padding: 10, justifyContent: "center" },
  compareUniCol: { width: 130, padding: 10, alignItems: "center", justifyContent: "center" },
  compareUniName: { color: Colors.white, fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold, textAlign: "center" },
  compareFieldLabel: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold, color: Colors.textPrimary },
  compareRow: { flexDirection: "row", borderTopWidth: 1, borderTopColor: Colors.border },
  compareFieldText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  compareValue: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textPrimary, textAlign: "center" },
  compareHint: { alignItems: "center", paddingVertical: 30 },
  compareHintText: { fontSize: Fonts.sizes.sm, color: Colors.textMuted, marginTop: 10 },
  calendarEvent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderLeftWidth: 4, paddingLeft: 12, paddingVertical: 10, marginBottom: 10, backgroundColor: Colors.background, borderRadius: 10 },
  calendarEventLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  calendarDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  calendarInfo: { flex: 1 },
  calendarUni: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  calendarEvent2: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  calendarRight: { alignItems: "flex-end" },
  calendarDate: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.error },
  openStatus: { fontSize: Fonts.sizes.xs, color: Colors.success },
  closedStatus: { fontSize: Fonts.sizes.xs, color: Colors.error },
  importantDates: { backgroundColor: Colors.primary + "08", borderRadius: 14, padding: 14, marginTop: 10 },
  importantDatesTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.primary, marginBottom: 12 },
  importantDate: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  importantDateEvent: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  importantDateValue: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.primary },
  interestGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  interestBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border },
  interestBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  interestBtnText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  interestBtnTextActive: { color: Colors.white },
  matchTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginBottom: 12 },
  matchCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.background, borderRadius: 12, padding: 12, marginBottom: 8, borderLeftWidth: 4 },
  matchInitials: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  matchInitialsText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  matchInfo: { flex: 1 },
  matchName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  matchPrograms: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary, marginTop: 2 },
  matchCity: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 1 },
  matchRank: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  uniSelectBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8, backgroundColor: Colors.background },
  uniSelectBtnText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  yearRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  yearBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border, alignItems: "center" },
  yearBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  yearBtnText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  yearBtnTextActive: { color: Colors.white },
  meritTable: { borderRadius: 12, overflow: "hidden", borderWidth: 1, borderColor: Colors.border },
  meritTableHeader: { flexDirection: "row", backgroundColor: Colors.primary, padding: 10 },
  meritTableHeaderText: { flex: 1, color: Colors.white, fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold, textAlign: "center" },
  meritTableRow: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  meritTableProgram: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary, textAlign: "center" },
  meritTableMerit: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.primary, textAlign: "center" },
  meritStatusBadge: { flex: 1, alignItems: "center", borderRadius: 6, paddingVertical: 2 },
  meritStatusText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold },
  scholarshipUniCard: { borderRadius: 14, overflow: "hidden", marginBottom: 12 },
  scholarshipUniHeader: { padding: 12, flexDirection: "row", justifyContent: "space-between" },
  scholarshipUniName: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  scholarshipUniCount: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.xs },
  scholarshipList: { backgroundColor: Colors.background, padding: 12 },
  scholarshipItem: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  scholarshipItemText: { fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  hostelCard: { backgroundColor: Colors.background, borderRadius: 14, padding: 14, marginBottom: 10 },
  hostelHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  hostelInitials: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  hostelInitialsText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  hostelInfo: { flex: 1 },
  hostelUniName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  hostelCity: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  hostelAvailable: { backgroundColor: Colors.success + "15", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  hostelAvailableText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.success },
  hostelNotAvailable: { backgroundColor: Colors.error + "15", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  hostelNotAvailableText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.semiBold, color: Colors.error },
  hostelDetails: { gap: 6 },
  hostelDetailItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  hostelDetailText: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  semesterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.background, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  semesterBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  semesterBtnText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  semesterBtnTextActive: { color: Colors.white },
  hostelToggle: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  toggleBox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.border, alignItems: "center", justifyContent: "center" },
  toggleBoxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  hostelToggleText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary },
  feeBreakdown: { backgroundColor: Colors.background, borderRadius: 14, padding: 14 },
  feeBreakdownTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 12 },
  feeRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  feeTotalRow: { borderBottomWidth: 0, paddingTop: 12, marginTop: 4 },
  feeLabel: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary },
  feeValue: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  feeTotalLabel: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary },
  feeTotalValue: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.primary },
  reviewCard: { backgroundColor: Colors.background, borderRadius: 14, padding: 14, marginBottom: 10 },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 10 },
  reviewAvatarText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  reviewYear: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  reviewStars: { flexDirection: "row" },
  reviewText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 20 },
  chatContainer: { backgroundColor: Colors.background, borderRadius: 14, overflow: "hidden" },
  chatMessages: { height: 200, padding: 10 },
  chatBubble: { backgroundColor: Colors.white, borderRadius: 14, padding: 10, marginBottom: 8, maxWidth: "85%", alignSelf: "flex-start" },
  chatBubbleUser: { backgroundColor: Colors.primary, alignSelf: "flex-end" },
  chatBubbleAI: { backgroundColor: Colors.white, alignSelf: "flex-start", borderRadius: 14, padding: 10, marginBottom: 8 },
  chatBubbleText: { fontSize: Fonts.sizes.sm, color: Colors.textPrimary, lineHeight: 18 },
  chatBubbleTextUser: { color: Colors.white },
  quickQuestions: { paddingVertical: 8, paddingHorizontal: 10, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  quickQ: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: Colors.primary + "15", marginRight: 8 },
  quickQText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.primary },
  chatInputRow: { flexDirection: "row", gap: 8, padding: 10, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  chatInput: { flex: 1, backgroundColor: Colors.background, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, fontSize: Fonts.sizes.sm, color: Colors.textPrimary, borderWidth: 1, borderColor: Colors.border },
  chatSendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  chatSendBtnDisabled: { backgroundColor: Colors.textMuted },
  detailContainer: { flex: 1, backgroundColor: Colors.background },
  detailHeader: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, alignItems: "center" },
  backBtn: { alignSelf: "flex-start", marginBottom: 12 },
  detailInitials: { width: 70, height: 70, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", marginBottom: 10 },
  detailInitialsText: { color: Colors.white, fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold },
  detailName: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, textAlign: "center" },
  detailCity: { color: "rgba(255,255,255,0.8)", fontSize: Fonts.sizes.sm, marginTop: 4 },
  openBadgeLg: { marginTop: 10, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  openBadgeLgText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
  closedBadgeLg: { marginTop: 10, backgroundColor: "rgba(0,0,0,0.2)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5 },
  closedBadgeLgText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
  detailTabs: { flexDirection: "row", backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailTab: { flex: 1, paddingVertical: 12, alignItems: "center" },
  detailTabActive: { borderBottomWidth: 2, borderBottomColor: Colors.primary },
  detailTabText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.textSecondary },
  detailTabTextActive: { color: Colors.primary, fontFamily: Fonts.bold },
  aboutText: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  infoIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  infoLabel: { fontSize: Fonts.sizes.xs, color: Colors.textSecondary },
  infoValue: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary, marginTop: 2 },
  detailSectionTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 10, marginTop: 16 },
  programItem: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Colors.background, borderRadius: 10, padding: 10, marginBottom: 6 },
  programItemText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary },
  facultyItem: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Colors.background, borderRadius: 10, padding: 10, marginBottom: 6 },
  facultyText: { fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  meritRow: { flexDirection: "row", justifyContent: "space-between", backgroundColor: Colors.background, borderRadius: 10, padding: 10, marginBottom: 6 },
  meritRowProg: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold, color: Colors.textPrimary },
  meritRowValue: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.primary },
  admissionStatus: { borderRadius: 14, padding: 16, alignItems: "center", borderWidth: 1.5, marginBottom: 16 },
  admissionStatusText: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, marginTop: 8 },
  admissionDeadline: { fontSize: Fonts.sizes.sm, color: Colors.textSecondary, marginTop: 4 },
  stepItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  stepNum: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 12 },
  stepNumText: { color: Colors.white, fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold },
  stepText: { flex: 1, fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  scholarItem: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  scholarText: { fontSize: Fonts.sizes.sm, color: Colors.textPrimary },
  facilityRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: Colors.background, borderRadius: 10, padding: 12, marginBottom: 6 },
  facilityText: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary },
  stars: { flexDirection: "row" },
  websiteBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 14, paddingVertical: 14, marginTop: 16, marginBottom: 32 },
  websiteBtnText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
});
