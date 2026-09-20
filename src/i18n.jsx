import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export const LANGS = [
  { id: 'en', label: 'EN', name: 'English', speech: 'en-IN' },
  { id: 'hi', label: 'हिं', name: 'हिंदी', speech: 'hi-IN' },
  { id: 'mr', label: 'मरा', name: 'मराठी', speech: 'mr-IN' },
]

/* [en, hi, mr] */
const S = {
  // ---- common
  appName: ['Aaple BMC', 'आपले BMC', 'आपले BMC'],
  next: ['Next', 'आगे', 'पुढे'],
  or: ['or', 'या', 'किंवा'],
  all: ['All', 'सभी', 'सर्व'],
  inProgress: ['In progress', 'प्रगति में', 'प्रगतीत'],
  fixed: ['Fixed', 'ठीक हुआ', 'दुरुस्त झाले'],
  submitted: ['Submitted', 'दर्ज हुई', 'नोंदवली'],
  fileReport: ['File a report', 'शिकायत दर्ज करें', 'तक्रार नोंदवा'],
  myReports: ['My reports', 'मेरी शिकायतें', 'माझ्या तक्रारी'],
  checkNumber: ['Check a complaint number', 'शिकायत नंबर जांचें', 'तक्रार क्रमांक तपासा'],
  reportIt: ['Report it', 'शिकायत भेजें', 'तक्रार पाठवा'],
  sayIt: ['Say it', 'बोलकर बताएं', 'बोलून सांगा'],
  typeIt: ['Type it', 'लिखकर बताएं', 'लिहून सांगा'],
  edit: ['Edit', 'बदलें', 'बदला'],
  what: ['What', 'क्या', 'काय'],
  where: ['Where', 'कहां', 'कुठे'],
  when: ['When', 'कब', 'केव्हा'],
  photo: ['Photo', 'फोटो', 'फोटो'],
  total: ['total', 'कुल', 'एकूण'],
  justNow: ['Just now', 'अभी', 'आत्ताच'],
  pending: ['Pending', 'बाकी', 'प्रलंबित'],
  anotherIssue: ['Report another issue', 'एक और समस्या रिपोर्ट करें', 'आणखी एक समस्या नोंदवा'],

  // ---- tabs
  tabHome: ['Home', 'होम', 'मुख्य'],
  tabReport: ['Report', 'रिपोर्ट', 'तक्रार'],
  tabAround: ['Around Me', 'आस-पास', 'जवळपास'],

  // ---- categories
  catPothole: ['Pothole', 'गड्ढा', 'खड्डा'],
  catGarbage: ['Garbage', 'कचरा', 'कचरा'],
  catStreetlight: ['Streetlight', 'स्ट्रीटलाइट', 'दिवा'],
  catFootpath: ['Footpath', 'फुटपाथ', 'पदपथ'],
  catWater: ['Water', 'पानी', 'पाणी'],
  catOther: ['Other', 'अन्य', 'इतर'],

  // ---- home
  homeEyebrow: ['Report a problem', 'समस्या बताएं', 'समस्या सांगा'],
  homeTitle: ['See something broken? Tell BMC.', 'कुछ टूटा दिखा? BMC को बताएं।', 'काही बिघडलेलं दिसलं? BMC ला सांगा.'],
  homeSub: ['A photo and a location is enough. You get a complaint number to track it.', 'एक फोटो और जगह काफी है। ट्रैक करने के लिए शिकायत नंबर मिलेगा।', 'एक फोटो आणि ठिकाण पुरेसं आहे. ट्रॅक करण्यासाठी तक्रार क्रमांक मिळेल.'],
  homeWhat: ['What do you want to report?', 'आप क्या रिपोर्ट करना चाहते हैं?', 'तुम्हाला काय नोंदवायचं आहे?'],
  homeOpen: ['Your open reports', 'आपकी चालू शिकायतें', 'तुमच्या चालू तक्रारी'],
  seeAll: ['See all', 'सभी देखें', 'सर्व पहा'],
  aroundYou: ['Around you', 'आपके आस-पास', 'तुमच्या जवळपास'],
  fixedThisWeek: ['{n} issues fixed this week', 'इस हफ्ते {n} समस्याएं ठीक हुईं', 'या आठवड्यात {n} समस्या दुरुस्त झाल्या'],
  stillOpen: ['{n} still in progress · See what changed', '{n} अभी प्रगति में · क्या बदला देखें', '{n} अजून प्रगतीत · काय बदललं ते पहा'],
  homeTip: ['Not sure what to report or how? Tap File a report and choose Say it. I will ask you step by step.', 'क्या और कैसे रिपोर्ट करें, पक्का नहीं? "शिकायत दर्ज करें" दबाएं और "बोलकर बताएं" चुनें। मैं एक-एक करके पूछूंगा।', 'काय आणि कसं नोंदवायचं हे नक्की नाही? "तक्रार नोंदवा" दाबा आणि "बोलून सांगा" निवडा. मी एक एक करून विचारेन.'],
  otherWaysLink: ['Other ways to reach BMC →', 'BMC तक पहुंचने के अन्य तरीके →', 'BMC पर्यंत पोहोचण्याचे इतर मार्ग →'],

  // ---- report hub
  hubTitle: ['Report', 'रिपोर्ट', 'तक्रार'],
  hubSub: ['File a new complaint or check one you already made.', 'नई शिकायत दर्ज करें या पुरानी की स्थिति देखें।', 'नवीन तक्रार नोंदवा किंवा आधीच्या तक्रारीची स्थिती पहा.'],
  hubFileSub: ['Photo, what and where. Takes about a minute.', 'फोटो, क्या और कहां। लगभग एक मिनट लगता है।', 'फोटो, काय आणि कुठे. साधारण एक मिनिट लागतो.'],
  hubCheckSub: ['Got a number from SMS or a poster? Look it up.', 'SMS या पोस्टर से नंबर मिला? यहां देखें।', 'SMS किंवा पोस्टरवरून क्रमांक मिळाला? इथे पहा.'],
  hubAnon: ['Anonymous by default. Your name or phone is not needed to file a complaint.', 'आपकी पहचान गुप्त रहती है। शिकायत के लिए नाम या फोन जरूरी नहीं।', 'तुमची ओळख गुप्त राहते. तक्रारीसाठी नाव किंवा फोन आवश्यक नाही.'],

  // ---- file start
  startQ: ['How would you like to report it?', 'आप कैसे रिपोर्ट करना चाहेंगे?', 'तुम्हाला कसं नोंदवायचं आहे?'],
  saySub: ['Talk to me in Marathi, Hindi or English. I will fill the form for you.', 'मराठी, हिंदी या अंग्रेज़ी में बोलें। फॉर्म मैं भर दूंगा।', 'मराठी, हिंदी किंवा इंग्रजीत बोला. फॉर्म मी भरेन.'],
  typeSub: ['Take a photo, pick the problem, confirm the location.', 'फोटो लें, समस्या चुनें, जगह पक्की करें।', 'फोटो काढा, समस्या निवडा, ठिकाण निश्चित करा.'],
  startNote: ['Both ways ask for the same three things: a photo, what is wrong, and where.', 'दोनों तरीकों में यही तीन चीज़ें चाहिए: फोटो, क्या खराब है, और कहां।', 'दोन्ही मार्गांत तीनच गोष्टी लागतात: फोटो, काय बिघडलंय, आणि कुठे.'],

  // ---- steps
  stepTitle: ['Report an issue', 'समस्या रिपोर्ट करें', 'समस्या नोंदवा'],
  photoQ: ['Take a photo of the problem.', 'समस्या का फोटो लें।', 'समस्येचा फोटो काढा.'],
  openCamera: ['Open camera', 'कैमरा खोलें', 'कॅमेरा उघडा'],
  photoHint: ['Location and time are added to the photo automatically.', 'जगह और समय फोटो में अपने आप जुड़ जाते हैं।', 'ठिकाण आणि वेळ फोटोत आपोआप जोडले जातात.'],
  retake: ['Retake photo', 'फिर से फोटो लें', 'पुन्हा फोटो काढा'],
  noPhoto: ['Continue without a photo', 'बिना फोटो आगे बढ़ें', 'फोटोशिवाय पुढे जा'],
  whatQ: ['What is the problem?', 'समस्या क्या है?', 'समस्या काय आहे?'],
  extra: ['Anything else?', 'और कुछ?', 'आणखी काही?'],
  optional: ['(optional)', '(वैकल्पिक)', '(ऐच्छिक)'],
  descPh: ['e.g. Near the bus stop, about 2 feet wide. Has been like this for a week.', 'जैसे: बस स्टॉप के पास, करीब 2 फुट चौड़ा। एक हफ्ते से ऐसा है।', 'उदा. बस स्टॉपजवळ, साधारण 2 फूट रुंद. आठवडाभर असंच आहे.'],
  preferSay: ['Prefer to say it instead?', 'बोलकर बताना चाहेंगे?', 'बोलून सांगायचं आहे?'],
  whereQ: ['Where is it?', 'यह कहां है?', 'हे कुठे आहे?'],
  detect: ['Detect my location', 'मेरी जगह पता करें', 'माझं ठिकाण शोधा'],
  detectSub: ["Uses your phone's GPS", 'आपके फोन का GPS इस्तेमाल होगा', 'तुमच्या फोनचा GPS वापरला जाईल'],
  enterAddr: ['Enter the address', 'पता लिखें', 'पत्ता लिहा'],
  enterAddrSub: ['Type a landmark, road or area', 'कोई लैंडमार्क, सड़क या इलाका लिखें', 'एखादी खूण, रस्ता किंवा परिसर लिहा'],
  finding: ['Finding your location…', 'आपकी जगह ढूंढ रहे हैं…', 'तुमचं ठिकाण शोधत आहोत…'],
  addrLabel: ['Address or landmark', 'पता या लैंडमार्क', 'पत्ता किंवा खूण'],
  addrPh: ['e.g. Opposite Jehangir Art Gallery, Fort', 'जैसे: जहांगीर आर्ट गैलरी के सामने, फोर्ट', 'उदा. जहांगीर आर्ट गॅलरीसमोर, फोर्ट'],
  useAddr: ['Use this address', 'यह पता इस्तेमाल करें', 'हा पत्ता वापरा'],
  detectInstead: ['Detect instead', 'GPS से पता करें', 'GPS ने शोधा'],
  location: ['Location', 'जगह', 'ठिकाण'],
  changeLoc: ['Change location', 'जगह बदलें', 'ठिकाण बदला'],
  readyQ: ['Ready to report?', 'रिपोर्ट करने को तैयार?', 'नोंदवायला तयार?'],
  goesTo: ['This goes to {ward} · {dept}. You will get a complaint number to track it. No name or phone required.', 'यह {ward} · {dept} को जाएगी। ट्रैक करने के लिए शिकायत नंबर मिलेगा। नाम या फोन जरूरी नहीं।', 'हे {ward} · {dept} कडे जाईल. ट्रॅक करण्यासाठी तक्रार क्रमांक मिळेल. नाव किंवा फोन आवश्यक नाही.'],
  sending: ['Sending…', 'भेज रहे हैं…', 'पाठवत आहोत…'],

  // ---- done
  reported: ['Reported.', 'दर्ज हो गई।', 'नोंदवली.'],
  withWard: ['Your complaint is with {ward}.', 'आपकी शिकायत {ward} के पास है।', 'तुमची तक्रार {ward} कडे आहे.'],
  cno: ['Complaint number', 'शिकायत नंबर', 'तक्रार क्रमांक'],
  keepNumber: ['Keep this to check status later. It also works on 1916.', 'स्थिति देखने के लिए इसे संभालकर रखें। 1916 पर भी काम करता है।', 'स्थिती पाहण्यासाठी हा जपून ठेवा. 1916 वरही चालतो.'],
  copy: ['Copy number', 'नंबर कॉपी करें', 'क्रमांक कॉपी करा'],
  copied: ['Copied', 'कॉपी हुआ', 'कॉपी झाला'],
  whatNext: ['What happens next', 'आगे क्या होगा', 'पुढे काय होईल'],
  received: ['Received', 'मिली', 'मिळाली'],
  assigned: ['Assigned to an engineer', 'इंजीनियर को सौंपी जाएगी', 'अभियंत्याकडे सोपवली जाईल'],
  within2: ['Usually within 2 days', 'आमतौर पर 2 दिन में', 'साधारण 2 दिवसांत'],
  escalateHint: ['You can escalate if nothing happens in 7 days', '7 दिन में कुछ न हो तो आगे बढ़ा सकते हैं', '7 दिवसांत काही झालं नाही तर पुढे पाठवू शकता'],
  viewReport: ['View my report', 'मेरी शिकायत देखें', 'माझी तक्रार पहा'],
  backHome: ['Back to home', 'होम पर जाएं', 'मुख्य पानावर जा'],

  // ---- my reports
  nothingYet: ['Nothing here yet.', 'अभी यहां कुछ नहीं।', 'इथे अजून काही नाही.'],
  haveNumber: ['Have a complaint number?', 'शिकायत नंबर है?', 'तक्रार क्रमांक आहे?'],
  haveNumberSub: ['Check its status without logging in.', 'बिना लॉगिन स्थिति देखें।', 'लॉगिन न करता स्थिती पहा.'],
  yourReport: ['Your report', 'आपकी शिकायत', 'तुमची तक्रार'],
  notFound: ['Report not found.', 'शिकायत नहीं मिली।', 'तक्रार सापडली नाही.'],
  type: ['Type', 'प्रकार', 'प्रकार'],
  ward: ['Ward', 'वॉर्ड', 'वॉर्ड'],
  reportedOn: ['Reported', 'दर्ज', 'नोंदवली'],
  dept: ['Dept.', 'विभाग', 'विभाग'],
  progress: ['Progress', 'प्रगति', 'प्रगती'],
  escalateTip: ['No update for 7 days? You can escalate this complaint from here, or call 1916 with the number.', '7 दिन से कोई अपडेट नहीं? यहां से शिकायत आगे बढ़ाएं, या नंबर लेकर 1916 पर कॉल करें।', '7 दिवस अपडेट नाही? इथून तक्रार पुढे पाठवा, किंवा क्रमांक घेऊन 1916 वर फोन करा.'],
  escalate: ['Escalate complaint', 'शिकायत आगे बढ़ाएं', 'तक्रार पुढे पाठवा'],
  checkTitle: ['Check status', 'स्थिति जांचें', 'स्थिती तपासा'],
  enterQ: ['Enter the complaint number you received.', 'आपको मिला शिकायत नंबर लिखें।', 'तुम्हाला मिळालेला तक्रार क्रमांक लिहा.'],
  checkErr: ['No complaint found with that number. Check and try again.', 'इस नंबर से कोई शिकायत नहीं मिली। जांचकर फिर कोशिश करें।', 'या क्रमांकाची तक्रार सापडली नाही. तपासून पुन्हा प्रयत्न करा.'],
  trySample: ['Try {n} to see a sample report.', 'उदाहरण देखने के लिए {n} आज़माएं।', 'नमुना पाहण्यासाठी {n} वापरून पहा.'],
  check: ['Check', 'जांचें', 'तपासा'],

  // ---- around
  aroundTitle: ['Around me', 'मेरे आस-पास', 'माझ्या जवळपास'],
  aroundSub: ['Issues reported within 1 km of {loc}.', '{loc} के 1 किमी के दायरे में दर्ज समस्याएं।', '{loc} च्या 1 किमी परिसरातील नोंदवलेल्या समस्या.'],
  thisWeek: ['This week', 'इस हफ्ते', 'या आठवड्यात'],
  aroundStats: ['{f} fixed · {o} in progress', '{f} ठीक हुईं · {o} प्रगति में', '{f} दुरुस्त · {o} प्रगतीत'],
  because: ['Because people around you reported them.', 'क्योंकि आपके आस-पास के लोगों ने रिपोर्ट किया।', 'कारण तुमच्या जवळच्या लोकांनी नोंदवल्या.'],
  nReports: ['{n} reports', '{n} रिपोर्ट', '{n} तक्रारी'],
  whatChanged: ['What changed?', 'क्या बदला?', 'काय बदललं?'],
  peopleReported: ['{n} people reported this · {d} from you', '{n} लोगों ने रिपोर्ट किया · आपसे {d}', '{n} लोकांनी नोंदवलं · तुमच्यापासून {d}'],
  before: ['Before', 'पहले', 'आधी'],
  after: ['After', 'बाद', 'नंतर'],
  fixedIn: ['Fixed in {d} days after the first complaint. Thanks to the people who reported it.', 'पहली शिकायत के {d} दिन में ठीक हुआ। रिपोर्ट करने वालों का धन्यवाद।', 'पहिल्या तक्रारीनंतर {d} दिवसांत दुरुस्त. नोंदवणाऱ्यांचे आभार.'],
  seeingToo: ['Seeing this too? Adding your report helps BMC prioritise it.', 'यह आपको भी दिख रहा है? आपकी रिपोर्ट से BMC इसे प्राथमिकता देगा।', 'तुम्हालाही हे दिसतंय? तुमच्या तक्रारीने BMC ला प्राधान्य ठरवायला मदत होते.'],
  iSeeToo: ['I see this too', 'मुझे भी दिख रहा है', 'मलाही दिसतंय'],

  // ---- other ways
  otherTitle: ['Other ways', 'अन्य तरीके', 'इतर मार्ग'],
  otherH: ['Prefer another way?', 'कोई और तरीका चाहिए?', 'दुसरा मार्ग हवा आहे?'],
  otherSub: ['All of these reach the same BMC complaint system and give you the same kind of number.', 'ये सभी उसी BMC शिकायत प्रणाली तक पहुंचते हैं और वैसा ही नंबर देते हैं।', 'हे सर्व त्याच BMC तक्रार प्रणालीपर्यंत पोहोचतात आणि तसाच क्रमांक देतात.'],
  otherTip: ['Whichever way you use, keep the complaint number. It is how you follow up.', 'जो भी तरीका अपनाएं, शिकायत नंबर संभालकर रखें। उसी से फॉलो-अप होता है।', 'कोणताही मार्ग वापरा, तक्रार क्रमांक जपून ठेवा. त्यानेच पाठपुरावा होतो.'],
  call1916: ['Call 1916', '1916 पर कॉल करें', '1916 वर फोन करा'],
  tollFree: ['Toll free · 24 hours', 'टोल फ्री · 24 घंटे', 'टोल फ्री · 24 तास'],
  website: ['Website', 'वेबसाइट', 'वेबसाइट'],

  // ---- assistant (Say it)
  botHello: ['Hello. I can file the complaint for you.', 'नमस्ते। मैं आपके लिए शिकायत दर्ज कर सकता हूं।', 'नमस्कार. मी तुमच्यासाठी तक्रार नोंदवू शकतो.'],
  botTellMe: ['Tell me what the problem is. You can speak, or type below.', 'बताइए समस्या क्या है। बोल सकते हैं, या नीचे लिख सकते हैं।', 'समस्या काय आहे ते सांगा. बोलू शकता, किंवा खाली लिहू शकता.'],
  botSoundsLike: ['That sounds like a {cat} problem. Is that right?', 'लगता है यह {cat} की समस्या है। सही है?', 'हे {cat} ची समस्या वाटते. बरोबर आहे?'],
  botWhichBest: ['Thanks. Which of these describes it best?', 'धन्यवाद। इनमें से कौन सा सबसे सही है?', 'धन्यवाद. यापैकी कोणतं सर्वात जवळचं आहे?'],
  yesRight: ['Yes, that is right', 'हां, सही है', 'हो, बरोबर आहे'],
  noElse: ['No, something else', 'नहीं, कुछ और', 'नाही, दुसरं काही'],
  botPickClosest: ['No problem. Pick the closest one:', 'कोई बात नहीं। सबसे करीबी चुनें:', 'हरकत नाही. जवळचं निवडा:'],
  botAskPhoto: ['Can you take a photo of it? It helps the team find the exact spot.', 'क्या आप इसका फोटो ले सकते हैं? इससे टीम को सही जगह मिलती है।', 'याचा फोटो काढू शकाल का? त्याने टीमला नेमकी जागा सापडते.'],
  takePhoto: ['Take photo', 'फोटो लें', 'फोटो काढा'],
  skip: ['Skip', 'छोड़ें', 'वगळा'],
  skipPhoto: ['Skip the photo', 'फोटो छोड़ें', 'फोटो वगळा'],
  botOkNoPhoto: ['Okay, we can continue without one.', 'ठीक है, बिना फोटो आगे बढ़ते हैं।', 'ठीक आहे, फोटोशिवाय पुढे जाऊ.'],
  herePhoto: ['Here is the photo.', 'यह रहा फोटो।', 'हा फोटो.'],
  botGotPhoto: ['Got it. The photo has the time ({t}) and location attached.', 'मिल गया। फोटो में समय ({t}) और जगह जुड़ी है।', 'मिळाला. फोटोत वेळ ({t}) आणि ठिकाण जोडलं आहे.'],
  botAskWhere: ['Where is it? I can use your phone location, or you can tell me the address.', 'यह कहां है? मैं आपके फोन की जगह ले सकता हूं, या आप पता बता सकते हैं।', 'हे कुठे आहे? मी तुमच्या फोनचं ठिकाण घेऊ शकतो, किंवा तुम्ही पत्ता सांगू शकता.'],
  useLoc: ['Use my location', 'मेरी जगह इस्तेमाल करें', 'माझं ठिकाण वापरा'],
  typeAddr: ['Type the address', 'पता लिखें', 'पत्ता लिहा'],
  botFoundIt: ['Found it: {loc}, {ward}.', 'मिल गया: {loc}, {ward}।', 'सापडलं: {loc}, {ward}.'],
  tellAddr: ['I will tell you the address', 'मैं पता बताता हूं', 'मी पत्ता सांगतो'],
  botGoAhead: ['Go ahead, type or say the landmark or road.', 'बताइए, लैंडमार्क या सड़क लिखें या बोलें।', 'सांगा, खूण किंवा रस्ता लिहा किंवा बोला.'],
  botNoted: ['Noted: {t}.', 'नोट किया: {t}।', 'नोंद केली: {t}.'],
  botHereIs: ['Here is what I have. Shall I report it?', 'मेरे पास यह है। रिपोर्ट कर दूं?', 'माझ्याकडे हे आहे. नोंदवू का?'],
  yesReport: ['Yes, report it', 'हां, रिपोर्ट करें', 'हो, नोंदवा'],
  editDetails: ['Edit details', 'जानकारी बदलें', 'माहिती बदला'],
  botSending: ['Sending to BMC…', 'BMC को भेज रहे हैं…', 'BMC ला पाठवत आहोत…'],
  attached: ['Attached', 'जुड़ा है', 'जोडला'],
  none: ['None', 'नहीं', 'नाही'],
  quick1: ['There is a pothole near the bus stop', 'बस स्टॉप के पास गड्ढा है', 'बस स्टॉपजवळ खड्डा आहे'],
  quick2: ['Garbage has not been collected for 3 days', 'तीन दिन से कचरा नहीं उठा', 'तीन दिवसांपासून कचरा उचलला नाही'],
  quick3: ['The streetlight outside is not working', 'बाहर की स्ट्रीटलाइट बंद है', 'बाहेरचा दिवा बंद आहे'],
  typeHere: ['Type here…', 'यहां लिखें…', 'इथे लिहा…'],
  listening: ['Listening…', 'सुन रहा हूं…', 'ऐकत आहे…'],
  useButtons: ['Use the buttons above', 'ऊपर के बटन इस्तेमाल करें', 'वरची बटणं वापरा'],
  switchTyping: ['Switch to typing', 'लिखकर बताएं', 'लिहून सांगा'],
  cannedProblem: ['There is a big pothole on the road near the bus stop. Rickshaws keep swerving around it.', 'बस स्टॉप के पास सड़क पर बड़ा गड्ढा है। रिक्शा उसके चारों ओर घूमते हैं।', 'बस स्टॉपजवळ रस्त्यावर मोठा खड्डा आहे. रिक्षा त्याच्या बाजूने वळतात.'],
  cannedAddr: ['Opposite Jehangir Art Gallery, Kala Ghoda', 'जहांगीर आर्ट गैलरी के सामने, काला घोड़ा', 'जहांगीर आर्ट गॅलरीसमोर, काळा घोडा'],
  yes: ['Yes', 'हां', 'हो'],
}

const IDX = { en: 0, hi: 1, mr: 2 }
const KEY = 'aaplebmc.lang'

const Ctx = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try { return localStorage.getItem(KEY) || 'en' } catch { return 'en' }
  })
  const setLang = useCallback((l) => {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch { /* ignore */ }
  }, [])

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  const t = useCallback((key, vars) => {
    const row = S[key]
    let s = row ? (row[IDX[lang]] ?? row[0]) : key
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v)
    return s
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t, meta: LANGS.find((l) => l.id === lang) }), [lang, setLang, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)
export const useT = () => useContext(Ctx).t
