import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, 
  StatusBar, Dimensions, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Linking
} from 'react-native';
import { 
  Mic, MapPin, BarChart3, User, Bell, Clock, 
  ChevronRight, Star, CheckCircle2, Play, 
  Send, MessageCircle, Shield, Zap, Info, Phone, Image
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Aastha Production Color Theme
const COLORS = {
  primary: '#173124',        
  primaryLight: '#2d4739',     
  primaryFixed: '#ccead6',   
  secondary: '#99460a',      
  surface: '#fbf9f6',        
  onSurface: '#1b1c1a',      
  outline: '#727973',        
  error: '#ba1a1a',
  whatsapp: '#25D366',
  white: '#ffffff',
};

// --- SCREENS ---

// 1. DASHBOARD (Mobile Feed)
const DashboardScreen = ({ onAccept, goToEcho }) => {
  const [accepted, setAccepted] = useState({});

  const handleAccept = (id, title) => {
    setAccepted(prev => ({ ...prev, [id]: true }));
    onAccept(`Mission Accepted: ${title}`);
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      <View style={styles.heroCard}>
        <View style={styles.levelBadge}>
          <Star size={12} color={COLORS.secondary} fill={COLORS.secondary} />
          <Text style={styles.levelText}>LEVEL 4 GUARDIAN</Text>
        </View>
        <Text style={styles.heroTitle}>Command Briefing — Welcome back.</Text>
        <View style={styles.heroStats}>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatVal}>1,240</Text>
            <Text style={styles.heroStatLbl}>XP earned</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatVal}>14</Text>
            <Text style={styles.heroStatLbl}>Tasks completed</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.reportBanner} onPress={goToEcho}>
        <View style={styles.reportIcon}>
          <Zap size={20} color={COLORS.white} fill={COLORS.white} />
        </View>
        <View style={{flex: 1, marginLeft: 12}}>
          <Text style={styles.reportTitleText}>Report New Signal</Text>
          <Text style={styles.reportSubText}>Submit field data via Echo Hub</Text>
        </View>
        <ChevronRight size={20} color={COLORS.primary} />
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔴 Urgent Missions</Text>
        {[
          { id: 'm1', title: 'Central Kitchen Logistics', desc: 'Urgent meal distribution in Ward 7.', color: '#ba1a1a', icon: '🍲' },
          { id: 'm2', title: 'Verna Node Medical Gap', desc: 'Critical supply check at node 12.', color: '#99460a', icon: '💊' }
        ].map(m => (
          <View key={m.id} style={styles.missionCard}>
            <View style={[styles.missionImg, { backgroundColor: m.color }]}>
              <Text style={{fontSize: 40}}>{m.icon}</Text>
              <View style={styles.tagCritical}>
                <Text style={styles.tagText}>DUE NOW</Text>
              </View>
            </View>
            <View style={styles.missionBody}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5}}>
                <Text style={styles.missionTitle}>{m.title}</Text>
                <View style={{flexDirection: 'row', gap: 10}}>
                  <TouchableOpacity onPress={() => Linking.openURL('tel:+919999999999')}>
                    <Phone size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => Linking.openURL('whatsapp://send?phone=919999999999')}>
                    <MessageCircle size={18} color={COLORS.whatsapp} />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.missionDesc}>{m.desc}</Text>
              <TouchableOpacity 
                style={[styles.acceptBtn, accepted[m.id] && {backgroundColor: '#eaf3de'}]} 
                onPress={() => handleAccept(m.id, m.title)}
                disabled={accepted[m.id]}
              >
                <Text style={[styles.acceptBtnText, accepted[m.id] && {color: '#4a6741'}]}>
                  {accepted[m.id] ? 'ACCEPTED' : 'ACCEPT MISSION'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// 0. REGISTRATION SCREEN (New)
const RegistrationScreen = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <View style={[styles.screen, { justifyContent: 'center' }]}>
      <View style={styles.echoHero}>
        <Text style={styles.echoTitle}>Join Aastha</Text>
        <Text style={styles.echoSub}>Register to start reporting community needs and coordinating interventions.</Text>
      </View>
      <View style={styles.inputContainerMobile}>
        <TextInput 
          style={styles.inputMobile} 
          placeholder="Full Name" 
          value={name}
          onChangeText={setName}
        />
        <TextInput 
          style={styles.inputMobile} 
          placeholder="Phone Number (+91)" 
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TouchableOpacity 
          style={[styles.acceptBtn, { marginTop: 20 }]} 
          onPress={() => onRegister({ name, phone })}
        >
          <Text style={styles.acceptBtnText}>CREATE VOLUNTEER ID</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 2. ECHO PORTAL (Enhanced with Vision & Multilingual)
const EchoPortalScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [stage, setStage] = useState(0);
  const [category, setCategory] = useState('Medical');
  const [lang, setLang] = useState('English');
  const [visionReport, setVisionReport] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
    setVisionReport(null);
    setTimeout(() => {
      setIsRecording(false);
      processReport();
    }, 3000);
  };

  const startImageAnalysis = () => {
    setIsAnalyzingImage(true);
    setVisionReport(null);
    setTimeout(() => {
      setIsAnalyzingImage(false);
      setVisionReport({
        title: "Gemini Vision: Critical Assessment",
        precautions: "1. Do not move the patient without spinal support.\n2. Apply pressure to control bleeding.\n3. Avoid further contact with local infrastructure.",
        tips: "Emergency Unit deployed. Estimated arrival: 8 mins."
      });
      setStage(4);
    }, 3000);
  };

  const processReport = async () => {
    setStage(1);
    setTimeout(() => setStage(2), 1500);
    setTimeout(() => setStage(3), 3000);
    setTimeout(() => setStage(4), 4500);
    setTimeout(() => setStage(5), 6000);
  };

  return (
    <ScrollView style={styles.screen}>
      <View style={styles.echoHero}>
        <Text style={styles.echoTitle}>Echo Field Hub</Text>
        <Text style={styles.echoSub}>Multilingual Voice & Vision Intelligence powered by Vertex AI.</Text>
      </View>

      <View style={styles.selectorSection}>
        <Text style={styles.smallLabel}>SERVICE LANGUAGE</Text>
        <View style={styles.categoryRow}>
          {['English', 'Hindi', 'Marathi', 'Konkani'].map(l => (
            <TouchableOpacity key={l} style={[styles.langChip, lang === l && styles.langChipActive]} onPress={() => setLang(l)}>
              <Text style={[styles.langChipText, lang === l && styles.langChipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.selectorSection}>
        <Text style={styles.smallLabel}>IMPACT CATEGORY</Text>
        <View style={styles.categoryRow}>
          {['Medical', 'Food', 'Water', 'Infra'].map(c => (
            <TouchableOpacity key={c} style={[styles.categoryChip, category === c && styles.categoryChipActive]} onPress={() => setCategory(c)}>
              <Text style={[styles.categoryChipText, category === c && styles.categoryChipTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity style={[styles.recordBtn, isRecording && styles.recordBtnActive]} onPress={startRecording}>
          <Mic size={32} color={isRecording ? COLORS.white : COLORS.primary} />
          <Text style={[styles.btnLabel, isRecording && {color: COLORS.white}]}>{isRecording ? 'Listening...' : 'Voice Report'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.visionBtn, isAnalyzingImage && styles.visionBtnActive]} onPress={startImageAnalysis}>
          <Image size={32} color={isAnalyzingImage ? COLORS.white : COLORS.primary} />
          <Text style={[styles.btnLabel, isAnalyzingImage && {color: COLORS.white}]}>{isAnalyzingImage ? 'Analyzing...' : 'Image Vision'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pipelineContainer}>
        <View style={[styles.pipelineItem, stage >= 1 && styles.pipelineActive]}>
          <CheckCircle2 size={16} color={stage >= 1 ? COLORS.primary : COLORS.outline} />
          <Text style={styles.pipelineText}>Vertex AI Multi-modal Ingestion</Text>
        </View>
        <View style={[styles.pipelineItem, stage >= 2 && styles.pipelineActive]}>
          <CheckCircle2 size={16} color={stage >= 2 ? COLORS.primary : COLORS.outline} />
          <Text style={styles.pipelineText}>Cloud Translation (Auto-detect: {lang})</Text>
        </View>
        <View style={[styles.pipelineItem, stage >= 3 && styles.pipelineActive]}>
          <CheckCircle2 size={16} color={stage >= 3 ? COLORS.primary : COLORS.outline} />
          <Text style={styles.pipelineText}>Gemini 1.5 Flash Analysis</Text>
        </View>
        <View style={[styles.pipelineItem, stage >= 4 && styles.pipelineActive]}>
          <CheckCircle2 size={16} color={stage >= 4 ? COLORS.primary : COLORS.outline} />
          <Text style={styles.pipelineText}>Broadcasting to 4 Nearby Responders...</Text>
        </View>
      </View>

      {visionReport && (
        <View style={styles.visionReportCard}>
          <Text style={styles.visionReportTitle}>{visionReport.title}</Text>
          <Text style={[styles.visionReportText, {fontWeight: 'bold', marginBottom: 5}]}>EMERGENCY PRECAUTIONS:</Text>
          <Text style={styles.visionReportText}>{visionReport.precautions}</Text>
          <View style={{height: 1, backgroundColor: '#eaf3de', marginVertical: 10}} />
          <Text style={[styles.visionReportText, {fontWeight: 'bold', marginBottom: 5}]}>URGENT TIPS:</Text>
          <Text style={styles.visionReportText}>{visionReport.tips}</Text>
        </View>
      )}

      {stage === 5 && !visionReport && (
        <View style={styles.successCard}>
          <Text style={styles.successTitle}>Signal Logged & Broadcasted</Text>
          <Text style={styles.successDesc}>Need Category: {category}. 4 nearby volunteers notified via Aastha Cloud.</Text>
        </View>
      )}
      <View style={{height: 40}} />
    </ScrollView>
  );
};

// 3. AI CHAT (Gemini/WhatsApp style)
const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! I am Gemini AI, your Aastha Assistant. How can I help you in the field today?', type: 'ai' }
  ]);
  const [input, setInput] = useState('');

  const generateResponse = (text) => {
    const inputLower = text.toLowerCase();
    if (inputLower.includes('medical') || inputLower.includes('medicine') || inputLower.includes('sick')) {
      return "Medical protocols active. I've flagged the Verna Node for extra antibiotics. Please ensure cold-chain storage for vaccines.";
    } else if (inputLower.includes('food') || inputLower.includes('hungry') || inputLower.includes('ration')) {
      return "Food logistics updated. The Central Kitchen has surplus meals for Ward 7. Coordinate with Rahul for distribution.";
    } else if (inputLower.includes('water') || inputLower.includes('leak') || inputLower.includes('drain') || inputLower.includes('flood')) {
      return "Water/Drainage emergency identified. PRE-RESCUE PROTOCOL: 1. Isolate local electrical mains if water is near substations. 2. Establish a 10m safety perimeter around the leakage source. 3. Advise residents to boil water until we verify contamination levels. Rescue Team Alpha is ETA 12 mins.";
    } else if (inputLower.includes('help') || inputLower.includes('what')) {
      return "I can assist with mission protocols, resource matching, and emergency advice. What's the situation on the ground?";
    }
    return "Understood. I'm analyzing that pattern against the Aastha impact ledger. Please provide the location ward if possible.";
  };

  const handleSend = () => {
    if (!input) return;
    const userMsg = { id: Date.now(), text: input, type: 'user' };
    setMessages([...messages, userMsg]);
    setInput('');

    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        text: generateResponse(input), 
        type: 'ai' 
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.screen}>
      <View style={styles.chatHeader}>
        <MessageCircle size={20} color={COLORS.whatsapp} />
        <Text style={styles.chatHeaderTitle}>Gemini AI Integration</Text>
        <View style={styles.onlineDot} />
      </View>
      <ScrollView style={styles.chatList} contentContainerStyle={{ padding: 15 }}>
        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageBubble, msg.type === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, msg.type === 'user' ? styles.userText : styles.aiText]}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Ask Gemini for guidance..." 
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Send size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// 4. USER PROFILE
const UserScreen = () => (
  <ScrollView style={styles.screen}>
    <View style={styles.profileHero}>
      <View style={styles.avatarLarge}>
        <Text style={styles.avatarText}>P</Text>
      </View>
      <Text style={styles.profileName}>Prathiksha</Text>
      <View style={styles.verifiedBadge}>
        <CheckCircle2 size={12} color={COLORS.primary} />
        <Text style={styles.verifiedText}>VERIFIED VOLUNTEER</Text>
      </View>
    </View>

    <View style={styles.profileSection}>
      <Text style={styles.profileSectionTitle}>Active Skills</Text>
      <View style={styles.skillRow}>
        {['Medical', 'Logistics', 'Driving'].map(s => (
          <View key={s} style={styles.skillChip}><Text style={styles.skillChipText}>{s}</Text></View>
        ))}
      </View>
    </View>

    <View style={styles.profileSection}>
      <Text style={styles.profileSectionTitle}>Cloud Sync Status</Text>
      <View style={styles.cloudCard}>
        <Shield size={20} color={COLORS.primary} />
        <Text style={styles.cloudText}>Stored in Google Cloud Firestore (asia-south1)</Text>
      </View>
    </View>
  </ScrollView>
);

// MAIN APP
export default function App() {
  const [activeTab, setActiveTab] = useState('feed');
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState(null);
  const [toast, setToast] = useState(null);

  const handleRegister = (data) => {
    setUserData(data);
    setIsRegistered(true);
    showToast(`Welcome ${data.name}! ID Created.`);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const renderScreen = () => {
    if (!isRegistered) return <RegistrationScreen onRegister={handleRegister} />;
    
    switch (activeTab) {
      case 'feed': return <DashboardScreen onAccept={showToast} goToEcho={() => setActiveTab('echo')} />;
      case 'echo': return <EchoPortalScreen />;
      case 'chat': return <ChatScreen />;
      case 'profile': return <UserScreen />;
      default: return <DashboardScreen onAccept={showToast} goToEcho={() => setActiveTab('echo')} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>AASTHA</Text>
        <View style={styles.headerRight}>
          <Bell size={20} color={COLORS.primary} />
          <View style={styles.userPill}><Text style={styles.userInitial}>P</Text></View>
        </View>
      </View>

      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Nav */}
      <View style={styles.tabBar}>
        {[
          { id: 'feed', icon: BarChart3, label: 'Dash' },
          { id: 'echo', icon: Mic, label: 'Echo' },
          { id: 'chat', icon: MessageCircle, label: 'AI Chat' },
          { id: 'profile', icon: User, label: 'User' },
        ].map(tab => (
          <TouchableOpacity key={tab.id} style={styles.tab} onPress={() => setActiveTab(tab.id)}>
            <tab.icon size={22} color={activeTab === tab.id ? COLORS.primary : COLORS.outline} />
            <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      {/* Google Cloud Indicator */}
      <View style={styles.googleIndicator}>
        <Zap size={10} color={COLORS.white} />
        <Text style={styles.googleIndicatorText}>GOOGLE CLOUD SYNCED</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  logoText: { fontSize: 20, fontWeight: '800', color: COLORS.primary, letterSpacing: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  userPill: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  userInitial: { color: COLORS.white, fontWeight: 'bold' },
  content: { flex: 1 },
  screen: { flex: 1, padding: 20 },
  
  // Dashboard
  heroCard: { backgroundColor: COLORS.primaryLight, borderRadius: 24, padding: 20, marginBottom: 20 },
  levelBadge: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.2)', padding: 5, borderRadius: 20, alignSelf: 'flex-start', alignItems: 'center', gap: 5, marginBottom: 10 },
  levelText: { color: COLORS.white, fontSize: 10, fontWeight: 'bold' },
  heroTitle: { color: COLORS.white, fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  heroStats: { flexDirection: 'row', gap: 10 },
  heroStat: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 12 },
  heroStatVal: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  heroStatLbl: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  missionCard: { backgroundColor: COLORS.white, borderRadius: 20, overflow: 'hidden', elevation: 3, shadowOpacity: 0.1, shadowRadius: 10 },
  missionImg: { height: 100, alignItems: 'center', justifyContent: 'center' },
  tagCritical: { position: 'absolute', top: 10, right: 10, bg: COLORS.white, padding: 5, borderRadius: 8 },
  tagText: { color: COLORS.error, fontSize: 10, fontWeight: 'bold' },
  missionBody: { padding: 15 },
  missionTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  missionDesc: { color: COLORS.outline, fontSize: 12, marginBottom: 15 },
  acceptBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, alignItems: 'center' },
  acceptBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 12 },

  // Echo
  echoHero: { marginBottom: 30 },
  echoTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary, marginBottom: 10 },
  echoSub: { color: COLORS.outline, lineHeight: 20 },
  recordContainer: { alignItems: 'center', marginVertical: 40 },
  recordBtn: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center' },
  recordBtnActive: { backgroundColor: COLORS.error, transform: [{scale: 1.1}] },
  recordStatus: { marginTop: 20, fontWeight: '600', color: COLORS.primary },
  pipelineContainer: { gap: 15 },
  pipelineItem: { flexDirection: 'row', gap: 10, alignItems: 'center', opacity: 0.4 },
  pipelineActive: { opacity: 1 },
  pipelineText: { fontSize: 13, fontWeight: '500' },
  successCard: { marginTop: 30, padding: 20, backgroundColor: COLORS.primaryFixed, borderRadius: 16 },
  successTitle: { fontWeight: 'bold', color: COLORS.primary, marginBottom: 5 },
  successDesc: { fontSize: 12, color: COLORS.primaryLight },

  // Chat
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 15, borderBottomWidth: 1, borderBottomColor: COLORS.surfaceDark },
  chatHeaderTitle: { fontWeight: 'bold', color: COLORS.primary },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.whatsapp },
  chatList: { flex: 1 },
  messageBubble: { padding: 12, borderRadius: 16, marginBottom: 10, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: COLORS.primary },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: COLORS.white, borderWith: 1, borderColor: COLORS.surfaceDark },
  messageText: { fontSize: 14, lineHeight: 20 },
  userText: { color: COLORS.white },
  aiText: { color: COLORS.onSurface },
  inputContainer: { flexDirection: 'row', padding: 15, gap: 10, alignItems: 'center' },
  input: { flex: 1, backgroundColor: COLORS.white, padding: 12, borderRadius: 25, borderWith: 1, borderColor: COLORS.surfaceDark },
  sendBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },

  // User
  profileHero: { alignItems: 'center', marginVertical: 30 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  avatarText: { color: COLORS.white, fontSize: 32, fontWeight: 'bold' },
  profileName: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  verifiedText: { fontSize: 10, fontWeight: 'bold', color: COLORS.outline },
  profileSection: { padding: 20, borderTopWidth: 1, borderTopColor: COLORS.surfaceDark },
  profileSectionTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 15, color: COLORS.outline },
  skillRow: { flexDirection: 'row', gap: 10 },
  skillChip: { backgroundColor: COLORS.primaryFixed, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  skillChipText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  cloudCard: { flexDirection: 'row', gap: 15, alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 16 },
  cloudText: { fontSize: 12, color: COLORS.primary, flex: 1 },

  // Nav
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.white, paddingVertical: 10, paddingBottom: 25, borderTopWidth: 1, borderTopColor: '#e4e2df' },
  tab: { flex: 1, alignItems: 'center', gap: 5 },
  tabLabel: { fontSize: 10, color: COLORS.outline },
  tabLabelActive: { color: COLORS.primary, fontWeight: 'bold' },
  
  // Registration & Mobile Inputs
  inputContainerMobile: { gap: 15 },
  inputMobile: { backgroundColor: COLORS.white, padding: 15, borderRadius: 16, borderWith: 1, borderColor: '#e4e2df', fontSize: 14 },
  
  // Category Selector
  categoryRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  categoryChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0edea', borderWith: 1, borderColor: '#e4e2df' },
  categoryChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryChipText: { fontSize: 12, fontWeight: '600', color: COLORS.outline },
  categoryChipTextActive: { color: COLORS.white },

  // Echo Enhanced
  selectorSection: { marginBottom: 20 },
  smallLabel: { fontSize: 9, fontWeight: 'bold', color: COLORS.outline, letterSpacing: 1, marginBottom: 8 },
  langChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: '#fcfbf8', borderWith: 1, borderColor: '#e4e2df', marginRight: 8 },
  langChipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primaryLight },
  langChipText: { fontSize: 10, fontWeight: 'bold', color: COLORS.primary },
  langChipTextActive: { color: COLORS.white },
  actionGrid: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  recordBtn: { flex: 1, height: 120, borderRadius: 24, backgroundColor: COLORS.primaryFixed, alignItems: 'center', justifyContent: 'center', gap: 10 },
  visionBtn: { flex: 1, height: 120, borderRadius: 24, backgroundColor: '#eaf3de', alignItems: 'center', justifyContent: 'center', gap: 10 },
  visionBtnActive: { backgroundColor: '#4a6741' },
  btnLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  visionReportCard: { marginTop: 20, padding: 20, backgroundColor: '#fcfbf8', borderRadius: 20, borderWith: 1, borderColor: '#eaf3de' },
  visionReportTitle: { fontSize: 14, fontBold: 'bold', color: '#4a6741', marginBottom: 10 },
  visionReportText: { fontSize: 11, color: COLORS.onSurface, lineHeight: 18 },

  toast: { position: 'absolute', bottom: 100, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  toastText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  googleIndicator: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 5 },
  googleIndicatorText: { color: COLORS.white, fontSize: 8, fontWeight: 'bold', letterSpacing: 0.5 }
});
