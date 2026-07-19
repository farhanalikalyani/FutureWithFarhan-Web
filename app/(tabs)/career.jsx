import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Modal } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { Fonts } from "../../constants/fonts";

const CAREERS = [
  {
    id: 1, title: "Software Engineer", icon: "code-slash-outline", color: "#3B82F6",
    salary: "PKR 80,000 - 500,000/month", growth: "Very High",
    description: "Design, develop and maintain software systems and applications.",
    roadmap: ["Matric/FSC with Computer Science", "BS Computer Science (4 years)", "Learn Programming (Python, JavaScript, Java)", "Build Projects & Portfolio", "Internships", "Get Certified (AWS, Google)", "Apply for Jobs"],
    skills: ["Programming", "Data Structures", "Algorithms", "Database", "Web Development", "Problem Solving"],
    universities: ["FAST", "NUST", "LUMS", "COMSATS", "UET"],
    resources: ["CS50 by Harvard (Free)", "Coursera Python", "freeCodeCamp", "LeetCode for Practice"],
  },
  {
    id: 2, title: "Doctor (MBBS)", icon: "medical-outline", color: "#EF4444",
    salary: "PKR 50,000 - 800,000/month", growth: "High",
    description: "Diagnose and treat illnesses, injuries and medical conditions.",
    roadmap: ["FSC Pre-Medical with 80%+", "Appear in MDCAT", "MBBS 5 Years", "House Job 1 Year", "FCPS or Specialization", "Practice"],
    skills: ["Biology", "Chemistry", "Anatomy", "Pharmacology", "Patient Care", "Diagnosis"],
    universities: ["KEMU", "Dow Medical", "NUMS", "AKU", "KMU"],
    resources: ["Guyton Physiology", "Robbins Pathology", "Katzung Pharmacology", "USMLE First Aid"],
  },
  {
    id: 3, title: "Data Scientist", icon: "analytics-outline", color: "#8B5CF6",
    salary: "PKR 100,000 - 600,000/month", growth: "Very High",
    description: "Analyze complex data to help organizations make better decisions.",
    roadmap: ["BS Mathematics/CS/Statistics", "Learn Python & R", "Machine Learning Basics", "Data Visualization", "Build ML Projects", "Kaggle Competitions", "Get Job"],
    skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization", "Deep Learning"],
    universities: ["NUST", "FAST", "LUMS", "IBA", "ITU"],
    resources: ["Kaggle Learn", "Fast.ai", "Andrew Ng ML Course", "Towards Data Science"],
  },
  {
    id: 4, title: "Civil Engineer", icon: "construct-outline", color: "#F59E0B",
    salary: "PKR 60,000 - 400,000/month", growth: "High",
    description: "Design and oversee construction of infrastructure projects.",
    roadmap: ["FSC Pre-Engineering", "Appear in ECAT", "BE Civil Engineering 4 Years", "PEC Registration", "Work Experience", "Specialization"],
    skills: ["Mathematics", "Physics", "AutoCAD", "Structural Analysis", "Project Management", "ETABS"],
    universities: ["UET Lahore", "NUST", "NED", "UET Taxila", "MUET"],
    resources: ["Engineering Mechanics by Hibbeler", "AutoCAD Tutorials", "ETABS Training", "PEC Guidelines"],
  },
  {
    id: 5, title: "CSS Officer", icon: "shield-outline", color: "#10B981",
    salary: "PKR 80,000 - 300,000/month", growth: "Stable",
    description: "Serve Pakistan as a federal civil servant in various departments.",
    roadmap: ["Any Bachelor's Degree 16 Years Education", "Prepare for CSS Exam 1-2 Years", "Pass Written Exam", "Pass Psychological Test", "Pass Viva Voce", "Training at MCMC", "Posting"],
    skills: ["English Essay", "Current Affairs", "Pakistan Affairs", "Islamic Studies", "General Knowledge", "Analytical Thinking"],
    universities: ["Any HEC Recognized University", "Punjab University", "QAU", "Karachi University"],
    resources: ["Dawn News Daily", "CSS Past Papers", "Jahangir Brothers Books", "CSS Forum"],
  },
  {
    id: 6, title: "AI Engineer", icon: "hardware-chip-outline", color: "#EC4899",
    salary: "PKR 150,000 - 800,000/month", growth: "Extremely High",
    description: "Build and deploy artificial intelligence systems and models.",
    roadmap: ["BS Computer Science", "Python & Mathematics", "Machine Learning", "Deep Learning", "LLMs & Transformers", "MLOps & Deployment", "Build AI Products"],
    skills: ["Python", "PyTorch/TensorFlow", "NLP", "Computer Vision", "Cloud Platforms", "Docker"],
    universities: ["NUST", "FAST", "LUMS", "ITU", "COMSATS"],
    resources: ["fast.ai", "Hugging Face", "DeepLearning.ai", "Papers With Code"],
  },
  {
    id: 7, title: "Accountant/CA", icon: "calculator-outline", color: "#14B8A6",
    salary: "PKR 50,000 - 500,000/month", growth: "High",
    description: "Manage financial records, audits, and tax for organizations.",
    roadmap: ["Matric + FA/FSC", "ICAP CA Foundation", "CA Inter", "CA Final", "Articleship 3 Years", "Qualify CA", "Practice or Job"],
    skills: ["Accounting", "Taxation", "Auditing", "Financial Reporting", "Excel", "ERP Systems"],
    universities: ["ICAP", "ICMAP", "IBA", "LSE", "BNU"],
    resources: ["ICAP Study Material", "AccountingCoach.com", "Investopedia", "ACCA Textbooks"],
  },
  {
    id: 8, title: "Freelancer", icon: "laptop-outline", color: "#6366F1",
    salary: "$500 - $10,000+/month", growth: "Unlimited",
    description: "Work independently providing services to clients worldwide.",
    roadmap: ["Learn a Skill (Design/Dev/Writing/Marketing)", "Create Portfolio", "Join Upwork/Fiverr", "Complete Small Projects", "Build Reviews", "Scale Up", "Earn in Dollars"],
    skills: ["Graphic Design", "Web Development", "Content Writing", "Digital Marketing", "Video Editing", "SEO"],
    universities: ["Self-Taught", "Online Courses", "YouTube", "Coursera"],
    resources: ["Upwork.com", "Fiverr.com", "Freelancer.com", "YouTube Tutorials"],
  },
];

const INTERNSHIPS = [
  { company: "Google", role: "Software Engineering Intern", location: "Remote/USA", deadline: "Dec 2025", link: "https://careers.google.com" },
  { company: "Microsoft", role: "Data Science Intern", location: "Remote", deadline: "Nov 2025", link: "https://careers.microsoft.com" },
  { company: "Arbisoft", role: "Python Developer Intern", location: "Lahore", deadline: "Aug 2025", link: "https://arbisoft.com/careers" },
  { company: "Systems Limited", role: "Software Engineer Intern", location: "Lahore/Karachi", deadline: "Sep 2025", link: "https://systemsltd.com" },
  { company: "10Pearls", role: "Full Stack Intern", location: "Karachi/Islamabad", deadline: "Oct 2025", link: "https://10pearls.com" },
];

const INTERVIEW_TIPS = [
  { tip: "Research the company thoroughly before the interview", icon: "search-outline" },
  { tip: "Practice common HR questions (Tell me about yourself, strengths/weaknesses)", icon: "chatbubble-outline" },
  { tip: "Dress professionally and arrive 10 minutes early", icon: "shirt-outline" },
  { tip: "Prepare questions to ask the interviewer", icon: "help-circle-outline" },
  { tip: "Use the STAR method for behavioral questions", icon: "star-outline" },
  { tip: "Follow up with a thank you email after the interview", icon: "mail-outline" },
];

export default function CareerScreen() {
  const [activeTab, setActiveTab] = useState("roadmaps");
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const TABS = [
    { id: "roadmaps", label: "Roadmaps", icon: "map-outline" },
    { id: "internships", label: "Internships", icon: "briefcase-outline" },
    { id: "freelancing", label: "Freelancing", icon: "laptop-outline" },
    { id: "interview", label: "Interview", icon: "mic-outline" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Career Hub 🚀</Text>
        <Text style={styles.headerSubtitle}>Plan your path to success</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.id} style={[styles.tab, activeTab === tab.id && styles.tabActive]} onPress={() => setActiveTab(tab.id)}>
            <Ionicons name={tab.icon} size={16} color={activeTab === tab.id ? Colors.white : Colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

        {/* Career Roadmaps */}
        {activeTab === "roadmaps" && (
          <View>
            <Text style={styles.sectionTitle}>Choose Your Career Path</Text>
            {CAREERS.map(career => (
              <TouchableOpacity key={career.id} style={styles.careerCard} onPress={() => { setSelected(career); setShowDetail(true); }} activeOpacity={0.8}>
                <View style={[styles.careerIcon, { backgroundColor: career.color + "18" }]}>
                  <Ionicons name={career.icon} size={28} color={career.color} />
                </View>
                <View style={styles.careerInfo}>
                  <Text style={styles.careerTitle}>{career.title}</Text>
                  <Text style={styles.careerSalary}>💰 {career.salary}</Text>
                  <View style={styles.growthBadge}>
                    <Text style={styles.growthText}>📈 Growth: {career.growth}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Internships */}
        {activeTab === "internships" && (
          <View>
            <Text style={styles.sectionTitle}>Latest Internships 💼</Text>
            <View style={styles.tipBox}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.info} />
              <Text style={styles.tipText}>Apply early! Most internships fill up fast.</Text>
            </View>
            {INTERNSHIPS.map((intern, i) => (
              <View key={i} style={styles.internCard}>
                <View style={styles.internHeader}>
                  <View style={styles.companyInitials}>
                    <Text style={styles.companyInitialsText}>{intern.company[0]}</Text>
                  </View>
                  <View style={styles.internInfo}>
                    <Text style={styles.companyName}>{intern.company}</Text>
                    <Text style={styles.internRole}>{intern.role}</Text>
                  </View>
                </View>
                <View style={styles.internMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>{intern.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
                    <Text style={styles.metaText}>Deadline: {intern.deadline}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.applyBtn} onPress={() => Linking.openURL(intern.link)}>
                  <Text style={styles.applyBtnText}>Apply Now</Text>
                  <Ionicons name="arrow-forward" size={14} color={Colors.white} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Freelancing Guide */}
        {activeTab === "freelancing" && (
          <View>
            <Text style={styles.sectionTitle}>Freelancing Guide 💻</Text>
            <View style={styles.earningCard}>
              <Text style={styles.earningTitle}>💵 Earn in Dollars from Pakistan</Text>
              <Text style={styles.earningDesc}>Millions of Pakistani freelancers earn from $500 to $10,000+ per month working from home!</Text>
            </View>
            {[
              { step: "1", title: "Choose a Skill", desc: "Web Dev, Graphic Design, Writing, Video Editing, Digital Marketing, Data Entry", icon: "bulb-outline", color: Colors.primary },
              { step: "2", title: "Learn the Skill", desc: "YouTube, Coursera, Udemy — Most resources are FREE. Spend 2-3 months learning.", icon: "book-outline", color: Colors.info },
              { step: "3", title: "Build Portfolio", desc: "Create 3-5 sample projects to show clients what you can do.", icon: "images-outline", color: Colors.success },
              { step: "4", title: "Create Profiles", desc: "Join Upwork, Fiverr, Freelancer.com with a professional profile and photo.", icon: "person-outline", color: Colors.warning },
              { step: "5", title: "Get First Client", desc: "Offer low rates initially to get reviews. First 5 reviews are the hardest.", icon: "people-outline", color: Colors.error },
              { step: "6", title: "Scale Up", desc: "Raise rates, get repeat clients, build a team and earn more!", icon: "trending-up-outline", color: Colors.gold },
            ].map((s, i) => (
              <View key={i} style={styles.stepCard}>
                <View style={[styles.stepNum, { backgroundColor: s.color }]}>
                  <Text style={styles.stepNumText}>{s.step}</Text>
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Ionicons name={s.icon} size={18} color={s.color} />
                    <Text style={styles.stepTitle}>{s.title}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{s.desc}</Text>
                </View>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Top Platforms</Text>
            {[
              { name: "Upwork", desc: "Best for professional services", link: "https://upwork.com", color: "#14A800" },
              { name: "Fiverr", desc: "Best for creative services", link: "https://fiverr.com", color: "#1DBF73" },
              { name: "Freelancer", desc: "Good for beginners", link: "https://freelancer.com", color: "#0E4EAD" },
              { name: "Toptal", desc: "Premium platform for experts", link: "https://toptal.com", color: "#204ECF" },
            ].map((p, i) => (
              <TouchableOpacity key={i} style={styles.platformCard} onPress={() => Linking.openURL(p.link)}>
                <View style={[styles.platformDot, { backgroundColor: p.color }]} />
                <View style={styles.platformInfo}>
                  <Text style={styles.platformName}>{p.name}</Text>
                  <Text style={styles.platformDesc}>{p.desc}</Text>
                </View>
                <Ionicons name="open-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Interview Prep */}
        {activeTab === "interview" && (
          <View>
            <Text style={styles.sectionTitle}>Interview Preparation 🎯</Text>
            {INTERVIEW_TIPS.map((tip, i) => (
              <View key={i} style={styles.tipCard}>
                <View style={styles.tipIcon}>
                  <Ionicons name={tip.icon} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.tipCardText}>{tip.tip}</Text>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Common Interview Questions</Text>
            {[
              "Tell me about yourself",
              "What are your strengths and weaknesses?",
              "Why do you want to work here?",
              "Where do you see yourself in 5 years?",
              "Why should we hire you?",
              "Describe a challenge you overcame",
              "What is your expected salary?",
              "Do you have any questions for us?",
            ].map((q, i) => (
              <View key={i} style={styles.questionCard}>
                <View style={styles.questionNum}>
                  <Text style={styles.questionNumText}>Q{i + 1}</Text>
                </View>
                <Text style={styles.questionText}>{q}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Career Detail Modal */}
      <Modal visible={showDetail} animationType="slide">
        {selected && (
          <View style={styles.detailContainer}>
            <View style={[styles.detailHeader, { backgroundColor: selected.color }]}>
              <TouchableOpacity onPress={() => setShowDetail(false)} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <View style={styles.detailIcon}>
                <Ionicons name={selected.icon} size={40} color={Colors.white} />
              </View>
              <Text style={styles.detailTitle}>{selected.title}</Text>
              <Text style={styles.detailSalary}>💰 {selected.salary}</Text>
              <View style={styles.detailGrowthBadge}>
                <Text style={styles.detailGrowthText}>📈 Growth: {selected.growth}</Text>
              </View>
            </View>
            <ScrollView style={styles.detailBody} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
              <Text style={styles.aboutText}>{selected.description}</Text>

              <Text style={styles.detailSectionTitle}>🗺️ Career Roadmap</Text>
              {selected.roadmap.map((step, i) => (
                <View key={i} style={styles.roadmapStep}>
                  <View style={[styles.roadmapNum, { backgroundColor: selected.color }]}>
                    <Text style={styles.roadmapNumText}>{i + 1}</Text>
                  </View>
                  {i < selected.roadmap.length - 1 && <View style={[styles.roadmapLine, { backgroundColor: selected.color + "40" }]} />}
                  <Text style={styles.roadmapText}>{step}</Text>
                </View>
              ))}

              <Text style={styles.detailSectionTitle}>🛠️ Required Skills</Text>
              <View style={styles.skillsGrid}>
                {selected.skills.map((skill, i) => (
                  <View key={i} style={[styles.skillChip, { backgroundColor: selected.color + "15", borderColor: selected.color + "40" }]}>
                    <Text style={[styles.skillText, { color: selected.color }]}>{skill}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.detailSectionTitle}>🎓 Top Universities</Text>
              <View style={styles.uniList}>
                {selected.universities.map((uni, i) => (
                  <View key={i} style={styles.uniChip}>
                    <Ionicons name="school-outline" size={14} color={Colors.primary} />
                    <Text style={styles.uniChipText}>{uni}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.detailSectionTitle}>📚 Learning Resources</Text>
              {selected.resources.map((res, i) => (
                <View key={i} style={styles.resourceItem}>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  <Text style={styles.resourceText}>{res}</Text>
                </View>
              ))}
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
  tabsScroll: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border, maxHeight: 60 },
  tab: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: Colors.background },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textSecondary },
  tabTextActive: { color: Colors.white },
  content: { flex: 1 },
  sectionTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 14, marginTop: 8 },
  careerCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  careerIcon: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 14 },
  careerInfo: { flex: 1 },
  careerTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary },
  careerSalary: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 3 },
  growthBadge: { marginTop: 4 },
  growthText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.medium, color: Colors.success },
  tipBox: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: Colors.info + "10", borderRadius: 10, padding: 12, marginBottom: 14 },
  tipText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.info, flex: 1 },
  internCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  internHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  companyInitials: { width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 12 },
  companyInitialsText: { color: Colors.white, fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold },
  internInfo: { flex: 1 },
  companyName: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary },
  internRole: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 2 },
  internMeta: { gap: 4, marginBottom: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary },
  applyBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 10 },
  applyBtnText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
  earningCard: { backgroundColor: Colors.gold + "15", borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.gold + "40" },
  earningTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 6 },
  earningDesc: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, lineHeight: 20 },
  stepCard: { flexDirection: "row", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  stepNum: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 14, flexShrink: 0 },
  stepNumText: { color: Colors.white, fontSize: Fonts.sizes.md, fontFamily: Fonts.bold },
  stepContent: { flex: 1 },
  stepHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  stepTitle: { fontSize: Fonts.sizes.md, fontFamily: Fonts.bold, color: Colors.textPrimary },
  stepDesc: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, lineHeight: 20 },
  platformCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10 },
  platformDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  platformInfo: { flex: 1 },
  platformName: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold, color: Colors.textPrimary },
  platformDesc: { fontSize: Fonts.sizes.xs, fontFamily: Fonts.regular, color: Colors.textSecondary, marginTop: 2 },
  tipCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10 },
  tipIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.primary + "15", alignItems: "center", justifyContent: "center", marginRight: 12 },
  tipCardText: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary, lineHeight: 20 },
  questionCard: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 10 },
  questionNum: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginRight: 12 },
  questionNumText: { color: Colors.white, fontSize: Fonts.sizes.xs, fontFamily: Fonts.bold },
  questionText: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary },
  detailContainer: { flex: 1, backgroundColor: Colors.background },
  detailHeader: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20, alignItems: "center" },
  backBtn: { alignSelf: "flex-start", marginBottom: 12 },
  detailIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 12 },
  detailTitle: { color: Colors.white, fontSize: Fonts.sizes.xl, fontFamily: Fonts.bold, textAlign: "center" },
  detailSalary: { color: "rgba(255,255,255,0.9)", fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, marginTop: 6 },
  detailGrowthBadge: { marginTop: 8, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  detailGrowthText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.semiBold },
  detailBody: { flex: 1 },
  aboutText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
  detailSectionTitle: { fontSize: Fonts.sizes.lg, fontFamily: Fonts.bold, color: Colors.textPrimary, marginBottom: 12, marginTop: 8 },
  roadmapStep: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16, position: "relative" },
  roadmapNum: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 14, flexShrink: 0, zIndex: 1 },
  roadmapNumText: { color: Colors.white, fontSize: Fonts.sizes.sm, fontFamily: Fonts.bold },
  roadmapLine: { position: "absolute", left: 15, top: 32, width: 2, height: 24 },
  roadmapText: { flex: 1, fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary, paddingTop: 6 },
  skillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  skillChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  skillText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium },
  uniList: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  uniChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: Colors.background, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  uniChipText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.medium, color: Colors.textPrimary },
  resourceItem: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  resourceText: { fontSize: Fonts.sizes.sm, fontFamily: Fonts.regular, color: Colors.textPrimary },
});
