import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export const LANGS = [
  { id: 'en', label: 'EN', name: 'English', speech: 'en-IN' },
  { id: 'hi', label: 'हिं', name: 'हिंदी', speech: 'hi-IN' },
  { id: 'mr', label: 'मरा', name: 'मराठी', speech: 'mr-IN' },
]

/* [en, hi, mr] */
const S = {
  // ---- common
  appName: ['Aapli BMC', 'आपली BMC', 'आपली BMC'],
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
  fileViaForm: ['File report via form', 'फॉर्म से शिकायत करें', 'फॉर्मद्वारे तक्रार करा'],
  fileViaChatBtn: ['File report via chat', 'चैट से शिकायत करें', 'चॅटवरून तक्रार करा'],
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
  homeOpen: ['Your open reports', 'आपकी चालू शिकायतें', 'तुमच्या चालू तक्रारी'],
  seeAll: ['See all', 'सभी देखें', 'सर्व पहा'],
  aroundYou: ['Around you', 'आपके आस-पास', 'तुमच्या जवळपास'],
  fixedThisWeek: ['{n} issues fixed this week', 'इस हफ्ते {n} समस्याएं ठीक हुईं', 'या आठवड्यात {n} समस्या दुरुस्त झाल्या'],
  stillOpen: ['{n} still in progress · See what changed', '{n} अभी प्रगति में · क्या बदला देखें', '{n} अजून प्रगतीत · काय बदललं ते पहा'],
  otherWaysLink: ['Other ways to reach BMC →', 'BMC तक पहुंचने के अन्य तरीके →', 'BMC पर्यंत पोहोचण्याचे इतर मार्ग →'],

  // ---- report hub
  hubTitle: ['Report', 'रिपोर्ट', 'तक्रार'],
  hubSub: ['File a new complaint or check one you already made.', 'नई शिकायत दर्ज करें या पुरानी की स्थिति देखें।', 'नवीन तक्रार नोंदवा किंवा आधीच्या तक्रारीची स्थिती पहा.'],
  hubFileSub: ['Photo, what and where. Takes about a minute.', 'फोटो, क्या और कहां। लगभग एक मिनट लगता है।', 'फोटो, काय आणि कुठे. साधारण एक मिनिट लागतो.'],
  hubCheckSub: ['Got a number from SMS or a poster? Look it up.', 'SMS या पोस्टर से नंबर मिला? यहां देखें।', 'SMS किंवा पोस्टरवरून क्रमांक मिळाला? इथे पहा.'],
  hubAnon: ['Anonymous by default. Your name or phone is not needed to file a complaint.', 'आपकी पहचान गुप्त रहती है। शिकायत के लिए नाम या फोन जरूरी नहीं।', 'तुमची ओळख गुप्त राहते. तक्रारीसाठी नाव किंवा फोन आवश्यक नाही.'],

  // ---- steps
  stepTitle: ['Report an issue', 'समस्या रिपोर्ट करें', 'समस्या नोंदवा'],
  photoQ: ['Take a photo of the problem.', 'समस्या का फोटो लें।', 'समस्येचा फोटो काढा.'],
  openCamera: ['Open camera', 'कैमरा खोलें', 'कॅमेरा उघडा'],
  photoHint: ['Location and time are added to the photo automatically.', 'जगह और समय फोटो में अपने आप जुड़ जाते हैं।', 'ठिकाण आणि वेळ फोटोत आपोआप जोडले जातात.'],
  retake: ['Retake photo', 'फिर से फोटो लें', 'पुन्हा फोटो काढा'],
  noPhoto: ['Continue without a photo', 'बिना फोटो आगे बढ़ें', 'फोटोशिवाय पुढे जा'],
  whatQ: ['What is the problem?', 'समस्या क्या है?', 'समस्या काय आहे?'],
  extra: ['Describe the problem', 'समस्या के बारे में लिखें', 'समस्येबद्दल लिहा'],
  required: ['Required', 'ज़रूरी', 'आवश्यक'],
  descPh: ['e.g. Near the bus stop, about 2 feet wide. Has been like this for a week.', 'जैसे: बस स्टॉप के पास, करीब 2 फुट चौड़ा। एक हफ्ते से ऐसा है।', 'उदा. बस स्टॉपजवळ, साधारण 2 फूट रुंद. आठवडाभर असंच आहे.'],
  recordVoice: ['Record a voice note', 'आवाज़ नोट रिकॉर्ड करें', 'आवाज नोंद रेकॉर्ड करा'],
  stopRecording: ['Stop recording', 'रिकॉर्डिंग रोकें', 'रेकॉर्डिंग थांबवा'],
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
  assigned: ['Assigned to a supervisor', 'सुपरवाइज़र को सौंपी जाएगी', 'पर्यवेक्षकाकडे सोपवली जाईल'],
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
  escalatedOn: ['Escalated on {t}', '{t} को आगे बढ़ाई गई', '{t} रोजी पुढे पाठवली'],
  escalateConfirmQ: ['Escalate this complaint?', 'क्या इस शिकायत को आगे बढ़ाएं?', 'ही तक्रार पुढे पाठवायची का?'],
  escalateConfirmNote: ['This sends it to a senior officer for faster action. Use this only if there has been no update in a while.', 'यह शिकायत वरिष्ठ अधिकारी को भेजता है ताकि जल्दी कार्रवाई हो। लंबे समय से अपडेट न हो तभी इसका इस्तेमाल करें।', 'यामुळे तक्रार वरिष्ठ अधिकाऱ्याकडे जाईल, जेणेकरून लवकर कारवाई होईल. बराच काळ अपडेट नसेल तरच हे वापरा.'],
  escalateYes: ['Yes, escalate', 'हां, आगे बढ़ाएं', 'हो, पुढे पाठवा'],
  escalateCancel: ['Cancel', 'रद्द करें', 'रद्द करा'],
  escalatedTitle: ['Complaint escalated.', 'शिकायत आगे बढ़ा दी गई।', 'तक्रार पुढे पाठवली.'],
  escalatedNote: ['A senior officer has been notified. You will get an update soon.', 'वरिष्ठ अधिकारी को सूचित कर दिया गया है। जल्द अपडेट मिलेगा।', 'वरिष्ठ अधिकाऱ्याला कळवले आहे. लवकरच अपडेट मिळेल.'],
  backToReport: ['Back to report', 'शिकायत पर वापस जाएं', 'तक्रारीकडे परत जा'],
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
  botHello: ["Hello! I'm here to help you report a problem to BMC.", "नमस्ते! मैं BMC को समस्या बताने में आपकी मदद करूंगा।", "नमस्कार! BMC ला समस्या कळवायला मी मदत करेन."],
  botTellMe: ["What's wrong? Tell me in your own words, by typing or with the mic. You can also pick a type below.", "क्या खराब है? अपने शब्दों में बताइए, लिखकर या माइक से। चाहें तो नीचे से प्रकार चुनें।", "काय बिघडलंय? तुमच्या शब्दांत सांगा, लिहून किंवा माइकने. हवं तर खालून प्रकार निवडा."],
  botWhichBest: ['Thanks for explaining. Which of these is it closest to?', 'बताने के लिए धन्यवाद। यह इनमें से किसके सबसे करीब है?', 'सांगितल्याबद्दल धन्यवाद. हे यापैकी कशाच्या सर्वात जवळ आहे?'],
  botAskPhoto: ['Can you take a photo of it? It helps the team find the exact spot.', 'क्या आप इसका फोटो ले सकते हैं? इससे टीम को सही जगह मिलती है।', 'याचा फोटो काढू शकाल का? त्याने टीमला नेमकी जागा सापडते.'],
  takePhoto: ['Take photo', 'फोटो लें', 'फोटो काढा'],
  skip: ['Skip', 'छोड़ें', 'वगळा'],
  skipPhoto: ['Skip the photo', 'फोटो छोड़ें', 'फोटो वगळा'],
  botOkNoPhoto: ['Okay, we can continue without one.', 'ठीक है, बिना फोटो आगे बढ़ते हैं।', 'ठीक आहे, फोटोशिवाय पुढे जाऊ.'],
  herePhoto: ['Here is the photo.', 'यह रहा फोटो।', 'हा फोटो.'],
  botGotPhoto: ['Thanks, that helps the team a lot.', 'धन्यवाद, इससे टीम को बहुत मदद मिलेगी।', 'धन्यवाद, याने टीमला खूप मदत होईल.'],
  botAskWhere: ['Where is it? I can use your phone location, or you can tell me the address.', 'यह कहां है? मैं आपके फोन की जगह ले सकता हूं, या आप पता बता सकते हैं।', 'हे कुठे आहे? मी तुमच्या फोनचं ठिकाण घेऊ शकतो, किंवा तुम्ही पत्ता सांगू शकता.'],
  useLoc: ['Use my location', 'मेरी जगह इस्तेमाल करें', 'माझं ठिकाण वापरा'],
  typeAddr: ['Type the address', 'पता लिखें', 'पत्ता लिहा'],
  botFoundIt: ['Found it: near {loc}. This falls under {ward}.', 'मिल गया: {loc} के पास। यह {ward} में आता है।', 'सापडलं: {loc} जवळ. हे {ward} मध्ये येतं.'],
  tellAddr: ['I will tell you the address', 'मैं पता बताता हूं', 'मी पत्ता सांगतो'],
  botGoAhead: ['Go ahead, type or say the landmark or road.', 'बताइए, लैंडमार्क या सड़क लिखें या बोलें।', 'सांगा, खूण किंवा रस्ता लिहा किंवा बोला.'],
  botNoted: ['Noted: {t}.', 'नोट किया: {t}।', 'नोंद केली: {t}.'],
  botHereIs: ["Here's what I'll send to BMC. Shall I go ahead?", "मैं BMC को यह भेजूंगा। भेज दूं?", "मी BMC ला हे पाठवेन. पाठवू का?"],
  yesReport: ['Yes, report it', 'हां, रिपोर्ट करें', 'हो, नोंदवा'],
  editDetails: ['Edit details', 'जानकारी बदलें', 'माहिती बदला'],
  botSending: ['Sending to BMC…', 'BMC को भेज रहे हैं…', 'BMC ला पाठवत आहोत…'],
  attached: ['Attached', 'जुड़ा है', 'जोडला'],
  none: ['None', 'नहीं', 'नाही'],
  typeHere: ['Type here…', 'यहां लिखें…', 'इथे लिहा…'],
  useButtons: ['Use the buttons above', 'ऊपर के बटन इस्तेमाल करें', 'वरची बटणं वापरा'],
  switchTyping: ['Switch to typing', 'लिखकर बताएं', 'लिहून सांगा'],
  cannedAddr: ['Opposite Jehangir Art Gallery, Kala Ghoda', 'जहांगीर आर्ट गैलरी के सामने, काला घोड़ा', 'जहांगीर आर्ट गॅलरीसमोर, काळा घोडा'],
  yes: ['Yes', 'हां', 'हो'],
  fileViaChat: ['File via chat instead', 'चैट से शिकायत करें', 'चॅटवरून तक्रार करा'],
  fileViaChatSub: ['Talk or type, like messaging a person. I will ask you step by step.', 'किसी से बात करने जैसा, बोलें या लिखें। मैं एक-एक करके पूछूंगा।', 'एखाद्या व्यक्तीशी बोलल्यासारखं, बोला किंवा लिहा. मी एक एक करून विचारेन.'],
  chatTitle: ['File via chat', 'चैट से शिकायत', 'चॅटवरून तक्रार'],
  botDone: ['Done. Your complaint is with {ward}. Keep this number to check on it later:', 'हो गया। आपकी शिकायत {ward} के पास है। बाद में स्थिति देखने के लिए यह नंबर रखें:', 'झालं. तुमची तक्रार {ward} कडे आहे. नंतर स्थिती पाहण्यासाठी हा क्रमांक जपून ठेवा:'],
  botWhatNext: ['A supervisor will be assigned in a few days. You can see every update in My reports.', 'कुछ दिनों में एक सुपरवाइज़र सौंपा जाएगा। हर अपडेट "मेरी शिकायतें" में दिखेगा।', 'काही दिवसांत एक पर्यवेक्षक नेमला जाईल. प्रत्येक अपडेट "माझ्या तक्रारी" मध्ये दिसेल.'],
  botStartOver: ['No problem. Let us start again. What is the problem?', 'कोई बात नहीं। फिर से शुरू करते हैं। समस्या क्या है?', 'हरकत नाही. पुन्हा सुरू करू. समस्या काय आहे?'],
  startOver: ['Start again', 'फिर से शुरू करें', 'पुन्हा सुरू करा'],
  readAloud: ['Read replies aloud', 'जवाब पढ़कर सुनाएं', 'उत्तरे वाचून दाखवा'],

  ackPothole: ["That's dangerous, especially for two-wheelers. Let's get it filled.", "यह खतरनाक है, खासकर दोपहिया वाहनों के लिए। इसे भरवाते हैं।", "हे धोकादायक आहे, विशेषतः दुचाकींसाठी. हे भरून घेऊ."],
  ackGarbage: ["Nobody should have to live next to that. Let's get it cleared.", "ऐसे कचरे के पास किसी को नहीं रहना चाहिए। इसे साफ करवाते हैं।", "अशा कचऱ्याजवळ कोणालाच राहावं लागू नये. हे साफ करून घेऊ."],
  ackStreetlight: ["A dark street doesn't feel safe. Let's get the light back on.", "अंधेरी सड़क सुरक्षित नहीं लगती। बत्ती फिर से चालू करवाते हैं।", "अंधाऱ्या रस्त्यावर सुरक्षित वाटत नाही. दिवा पुन्हा सुरू करून घेऊ."],
  ackFootpath: ["Broken footpaths are easy to trip on. Let's get it repaired.", "टूटे फुटपाथ पर ठोकर लगना आसान है। इसे ठीक करवाते हैं।", "तुटलेल्या पदपथावर अडखळणं सोपं आहे. हे दुरुस्त करून घेऊ."],
  ackWater: ["That's a lot of wasted water. Let's get the team to fix it.", "इतना पानी बर्बाद हो रहा है। टीम से इसे ठीक करवाते हैं।", "इतकं पाणी वाया जातंय. टीमकडून हे दुरुस्त करून घेऊ."],
  ackOther: ["Thanks for explaining. I'll make sure it reaches the right team.", "बताने के लिए धन्यवाद। मैं इसे सही टीम तक पहुंचाऊंगा।", "सांगितल्याबद्दल धन्यवाद. मी हे योग्य टीमपर्यंत पोहोचवेन."],
  change: ['Change', 'बदलें', 'बदला'],
  // ---- voice note (What step)
  listening: ['Listening…', 'सुन रहा हूं…', 'ऐकत आहे…'],
  cannedProblem: ['There is a big pothole on the road near the bus stop. Rickshaws keep swerving around it.', 'बस स्टॉप के पास सड़क पर बड़ा गड्ढा है। रिक्शा उसके चारों ओर घूमते हैं।', 'बस स्टॉपजवळ रस्त्यावर मोठा खड्डा आहे. रिक्षा त्याच्या बाजूने वळतात.'],

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
