/* ================
   SUPABASE (online database + login)
   Needs this in index.html BEFORE script.js:
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>
   ================ */
const SUPABASE_URL = "https://qchsykknkkcutexjqxml.supabase.co";
const SUPABASE_KEY = "sb_publishable_dr9j1EMAqlBik88UQ1vGGQ_IipN5ZC8";
const supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Student Number -> pseudo email (Supabase Auth needs an email)
function toEmail(studentNumber){
    const clean = String(studentNumber).trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");
    return clean ? clean + "@gwa.local" : "";
}

// Dean's Lister requirement: GWA of 1.75 or better (lower is better). Change here if your school uses another cut-off.
let DEANS_LIST_MAX = 1.75;   // can be changed in SETTINGS
/* ================
   GWA CALCULATOR 
   ================ */

const COURSES = [
  "BSBA - Human Resource Management",
  "BSEd - Mathematics",
  "BIT - Computer Technology",
  "BSEd - Social Studies",
  "BS Nursing"
];

let selectedCourse = getSelectedCourse() || "";

const COURSE_COLOR_CLASSES = {
  "BSBA - Human Resource Management": "course-yellow",
  "BSEd - Mathematics": "course-green",
  "BIT - Computer Technology": "course-blue",
  "BSEd - Social Studies": "course-maroon",
  "BS Nursing": "course-pink"
};

const COURSE_LOGOS = {
  "BSBA - Human Resource Management": "hrm",
  "BSEd - Mathematics": "math",
  "BIT - Computer Technology": "computer",
  "BSEd - Social Studies": "social",
  "BS Nursing": "nursing"
};

function courseLogoHtml(course){
    const name = COURSE_LOGOS[course];
    if(!name) return "";
    return `<div class="logo-pair">
      <img class="course-logo" src="school-logo.png" alt="SLSU Gumaca Campus" onerror="this.style.display='none'">
      <img class="course-logo" src="logos/${name}.png" alt="" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='logos/${name}.svg';}else{this.style.display='none';}">
    </div>`;
}


function setBackgroundLogo(course){
    const name = course && COURSE_LOGOS[course];
    const urls = name ? ["logos/" + name + ".png", "logos/" + name + ".svg", "school-logo.png"] : ["school-logo.png"];
    let i = 0;
    const probe = new Image();
    probe.onload = function(){ document.body.style.setProperty("--bg-logo", 'url("' + urls[i] + '")'); };
    probe.onerror = function(){ i++; if(i < urls.length) probe.src = urls[i]; };
    probe.src = urls[0];
}

/* ================
    All Curriculum
   ================ */

const curriculum = {
"BSBA - Human Resource Management":{
1:{
 first:[
  ["GE02","Understanding the Self",3],["GE03","Readings in Philippine History",3],
  ["GE08","Mathematics in the Modern World",3],["GE04","Purposive Communication",3],
  ["PATHFIT01","Movement and Wellness",2],["NSTP01","National Service Training Program 1",3]
 ],
 second:[
  ["GE01","Life and Works of Rizal",3],["GE04","The Contemporary World",3],
  ["GE08","Science, Technology and Society",3],["HRM03","Human Resource Management",3],
  ["PATHFIT02","Fitness and Wellness Activities",2],["NSTP02","National Service Training Program 2",3],
  ["BAC01","Business Law",3]
 ]},
2:{
 first:[
  ["GE07","Art Appreciation",3],["GE11","Komunikasyon sa Filipino",3],["BAC01","Basic Microeconomics",3],
  ["HRM01","Admin and Office Management",3],["BAC01","Good Governance and Social Responsibility",3],
  ["GE13","Literature of the Philippines",3],["PATHFIT03","Rhythmic Activities and/or Sports",2]
 ],
 second:[
  ["GE06","Ethics",3],["HRM03","Business Analytic Fundamentals",3],["DAC01","Income Taxation",3],
  ["HRM05","Recruitment & Selection",3],["HRM07","Training & Development",3],
  ["GE11","Filipino sa Ibang Daigdig",3],["PATHFIT04","Recreational Activities",2]
 ]},
3:{
 first:[
  ["HRM01","Operations Management (TQM)",3],["HRM02","International Business and Trade",3],
  ["HRM05","Payroll Management",3],["HRM04","Labor Law & Legislations",3],
  ["HRM06","Compensation Administration",3],["HRM21","Entrepreneurial Management",3],
  ["HRM07","Fundamentals of HR Analytics",3]
 ],
 second:[
  ["HRM02","Strategic Management",3],["HRM06","Labor Relations & Negotiations",3],
  ["HRM20","Logistics Management",3],["HRM04","Marketing Management",3],
  ["HRM12","Human Resource Information System (HRIS)",3],["HRM21","Business Research (Methods of Research)",3]
 ]},
4:{
 first:[
  ["HRM03","Thesis (Paper Writing)",3],["HRM07","Organizational Development",3],
  ["HRM08","Special Topics in HRM (with TAE)",3]
 ],
 second:[
  ["OJT","Practicum/Work Integrated Learning",6]
 ]}
},

"BSEd - Mathematics":{
1:{
 first:[
  ["GEC01","The Life and Works of Rizal",3],["GEC04","The Contemporary World",3],
  ["GEC08","Science, Technology & Society",3],["GEC10","Komunikasyon sa Filipino",3],
  ["PATHFIT01","Movement Skill Training",2],["NSTP01","ROTC/CWTS",3],
  ["PED01","The Child & Adolescent Learners and Learning Principles",3],
  ["MAT01","College and Advanced Algebra",3],["MAT12","Logic and Set Theory",3]
 ],
 second:[
  ["GEC02","Understanding the Self",3],["GEC05","Mathematics in the Modern World",3],
  ["GEC06","Purposive Communication",3],["PATHFIT02","Fitness and Wellness Activities",2],
  ["NSTP02","ROTC/CWTS",3],["PED04","Foundation of Special and Inclusive Education",3],
  ["MAT08","History of Mathematics",3],["MAT02","Trigonometry",3],["MAT03","Plane and Solid Geometry",3]
 ]},
2:{
 first:[
  ["GEC09","Ethics",3],["GEC11","Filipino sa Iba't Ibang Disiplina",3],
  ["PED02","The Teaching Profession",3],["PED09","The Teacher and the School Curriculum",3],
  ["MAT04b","Calculus 1 and Analytic Geometry",4],["MAT21","Modern Geometry",3],
  ["STA04","Elementary Statistics and Probability",3],["PATHFIT03","Rhythmic Activities and/or Sports",2]
 ],
 second:[
  ["GEC07","Art Appreciation",3],["GEL04","Living in the IT Era",3],
  ["PED03","The Teachers & the Community, School Culture & Organizational Leadership",3],
  ["PED10","Building & Enhancing New Literacies Across Curriculum",3],
  ["STA05","Advanced Statistics",3],["MAT05a","Calculus 2",4],
  ["MAT17","Number Theory",3],["PATHFIT04","Recreational Activities",2]
 ]},
3:{
 first:[
  ["PED08","Technology for Teaching & Learning 1",3],["PED06","Assessment in Learning 1",3],
  ["PED05","Facilitating Learner-centered Teaching",3],["MAT06a","Calculus 3",3],
  ["MAT18","Principles and Strategies of Teaching Mathematics",3],["MAT19","Research in Mathematics",4]
 ],
 second:[
  ["GEC03","Reading in Philippine History",3],["PED07","Assessment in Learning 2",3],
  ["MAT13","Mathematics of Investment",3],["MAT15","Abstract Algebra",3],
  ["MAT20","Problem Solving, Mathematical Investigation and Modeling",3],
  ["MAT16","Under Algebra",3],["MAT21","Assessment and Evaluation in Mathematics",3]
 ]},
4:{
 first:[
  ["FS001","Field Study 01",3],["FS002","Field Study 02",3],
  ["TCO01","Integrative Course for Teaching",3],["MAT22","Technology for Teaching and Learning 2",3],
  ["MAT01","Data Analysis with Computer Software Applications",3]
 ],
 second:[["PED11","Teaching Internship",6]]
}},

"BIT - Computer Technology":{
1:{
 first:[
   ["CPT02","Fundamentals of Electricity and Electronic",3],["CPT04","Computer Systems and Hardware",3],
  ["CPT05","Logic and Switching Theory",2],["IT01","Introduction to Information Technology",3],
  ["COM01","Computer Programming",3],["GEC01","The Life and Works of Rizal",3],
  ["GEC04","The Contemporary World",3],["PATHFIT01","Movement Skill Training",2],
  ["NSTP01","National Service Training Program 1",3]
 ],
 second:[
 ["CPT01","Occupational Safety and Health",3],["CPT08","Computer Installation and Servicing",4],
  ["IT15","Computer Networking 1",3],["IND01","Industrial Drawing",2],
  ["GEC02","Understanding the Self",3],["GEC05","Mathematics in the Modern World",3],
  ["PATHFIT02","Fitness and Wellness Activities",2],["NSTP02","National Service Training Program 2",3]
 ]},
2:{
 first:[
 ["CPT14","Specialized Technology 1",3],
  ["CHM01a","Chemistry for Industrial Technology",3],["MAT04a","Comprehensive Mathematics",5],
  ["GEC08","Science, Technology and Society",3],["GEC09","Ethics",3],
  ["GEL07","Gender and Society",3],["GEL10","Philippine Popular Culture",3],
  ["PATHFIT03","Rhythmic Activities and/or Sports",2]
 ],
 second:[
  ["CPT14","Specialized Technology 2",3],["CPT16","Advanced Programming",4],
  ["PHY01a","Physics for Industrial Technology",3],["GEC03","Reading in Philippine History",3],
  ["GEC06","Purposive Communication",3],["GEC07","Art Appreciation",3],
  ["GEL01","Environmental Science",3],["PATHFIT04","Recreational Activities",2]
 ]},
3:{
 first:[
   ["CPT17","Embedded Systems",4],["CPT18","Platform Technology",3],["CPT19","Information Management",3],
  ["RES01a","Project Study 1 with Intelectual PropertyRights",3],["PSY11a","Industrial Psychology",3],
  ["FLO01","Foreign Language",3],["MTM01","Materials Technology Management",3]
 ],
 second:[
 ["ITE28","Emerging Technology Technologies",3],["RES02a","Research 2: Project Study 2",3],
  ["CPT11a","Seminar in Computer Technology",3],["IEN08a","Quality Control and Assurance",3],
  ["EN04a","IndustrialOrganization Management",3],["MGT02","Technotership",3],
  ["IEN11a","Production Management",3],["ITE13a","Professional Issues in Compurting",3]
 ]},
4:{
 first:[["SIP01","Student Internship Program 1 (600hrs)",6]],
 second:[["SIP02","Student Internship Program 2 (600hrs)",6]]
}},

"BSEd - Social Studies":{
1:{
 first:[
  ["GEC01","The Life and Works of Rizal",3],["GEC04","The Contemporary World",3],
  ["GEC08","Science, Technology & Society",3],["GEC10","Komunikasyon sa Filipino",3],
  ["PATHFIT01","Movement Skill Training",2],["NSTP01","ROTC/CWTS",3],
  ["PED01","The Child & Adolescent Learners and Learning Principles",3],
  ["FSED01","Foundation of Special Inclusive Education",3],["SSE05","Geography 1",3]
 ],
 second:[
  ["GEC02","Understanding the Self",3],["GEC03","Readings in Philippine History",3],
  ["GEC05","Mathematics in the Modern World",3],["GEC06","Purposive Communication",3],
  ["PATHFIT02","Fitness and Wellness Activities",2],["NSTP02","ROTC/CWTS",3],
  ["PED04","Foundation of Special and Inclusive Education",3],["SSE09","Geography 2",3],
  ["SSE14","Asian Studies",3]
 ]},
2:{
 first:[
  ["GEC09","Ethics",3],["GEC11","Filipino sa Iba't Ibang Disiplina",3],["PED02","The Teaching Profession",3],
  ["PED09","The Teacher & the School Curriculum",3],["FSED04","Places and Landscape in a Changing World",3],
  ["SSE11","World History",3],["SSE14","Micro Economics",3],["SSE13","Anthropology",3],
  ["PATHFIT03","Rhythmic Activities and/or Sports",2]
 ],
 second:[
  ["GEC07","Art Appreciation",3],["GEL04","Daluyan sa Filipino",3],
  ["PED03","The Teachers & the Community, School Culture & Organizational Leadership",3],
  ["PED10","Building & Enhancing New Literacies Across Curriculum",3],
  ["SSE10","Geography 3",3],["SSE15","Comparative Government",3],
  ["SSE11","World History 2",3],["PATHFIT04","Recreational Activities",2]
 ]},
3:{
 first:[
  ["PED08","Technology for Teaching & Learning 1",3],["PED06","Assessment in Learning 1",3],
  ["PED05","Facilitating Learner-centered Teaching",3],["SSE21","Teaching Approaches in Secondary Social Studies",3],
  ["SSE24","Assessment and Evaluation in Social Economic Planning",3],["FSED02","Research in Social Studies",3]
 ],
 second:[
  ["SSE08","Law Related Studies",3],["PED07","Assessment in Learning 2",3],
  ["SSE25","Technology for Teaching and Learning 2",3],["SSE22","Production of Social Studies Instructional Materials",3],
  ["SSE20","Social Networking for Social Integration",3],["SSE34","Integrative Methods in Teaching Social Science Discipline in Basic Education",3]
 ]},
4:{
 first:[
  ["FS001","Field Study 01",3],["FS002","Field Study 02",3],
  ["TCO01","Integrative Course for Teaching",3],["ELED02","Human Resource Management",3]
 ],
 second:[["PED11","Teaching Internship",6]]
}},

"BS Nursing":{
1:{
 first:[
  ["NCM00","Theoretical Foundation of Nursing",3],["NPS02","Anatomy and Physiology",5],
  ["BIO00","Biochemistry",5],["PATHFIT01","Physical Fitness",2],["GEC03","Readings in Philippine History",3],
  ["GEC06","Purposive Communication",3],["GEC10","Kontemporaryong Komunikasyon sa Filipino",3],
  ["NSTP01","National Service Training Program 1",3]
 ],
 second:[
  ["NCN01","Health Assessment",5],["NCN02","Health Education",3],
  ["NCM03","Fundamentals of Nursing",5],["NPS03","Microbiology and Parasitology",4],
  ["PATHFIT02","Rhythmic Activities",2],["GEC02","Understanding the Self",3],
  ["GEC11","Filipino sa Iba't ibang Disiplina",3],["NSTP02","National Service Training Program 2",3]
 ]},
2:{
 first:[
  ["NCN04","Community Health Nursing 1: Individual and Family as Client",4],
  ["NCN05","Nutrition and Diet Therapy",3],["NCN06","Pharmacology",3],
  ["NCN07","Care of Mother, Child-Adolescent (Well Client)",9],["GEC09","Ethics",3],
  ["PATHFIT03","Individual/Dual Sports",2]
 ],
 second:[
  ["NCN08","Health Care Ethics (Bioethics)",3],["NCN09","Care of Older and Adult-as-a Person",12],
  ["PATHFIT04","Team Sports/Games",2],["GEC01","The Life and Works of Rizal",3],
  ["GEC05","Mathematics in the Modern World",3],["GEC07","Art Appreciation",3],
  ["GEC08","Science, Technology and Society",3]
 ]},
3:{
 first:[
  ["NCN10","Nursing Informatics",3],["NCN11","Nursing Research 1",3],
  ["NCN12","Care of Clients with Problems in Oxygenation, Fluid & Electrolytes, Infections, Inflammatory & Immunologic Response, Cellular Aberration, Acute & Chronic",14],
  ["NCN13","Community Health Nursing 2: Population Groups and Community as Client",3]
 ],
 second:[
  ["NCN14","Care of the Older Person",3],["NCN15","Nursing Research 2",2],
  ["NCN16","Care of the Clients with Problems in Nutrition and GI Metabolism and Endocrine, Perception and Coordination, Acute and Chronic",9],
  ["NCN17","Care of the Clients with Maladaptive Patterns of Behavior, Acute & Chronic",8]
 ]},
4:{
 first:[
  ["NCN18","Care of Clients with Life Threatening Conditions/ Emergency and Urgent Care",9],
  ["NCN19","Nursing Leadership and Management",7],["GEC13","Literature",3],
  ["HUM03","Logic and Critical Thinking",3],["NCN20","Descriptive and Visual Epidemiology and Transcultural Nursing",3]
 ],
 second:[
  ["NCN00","Hospice Care Nursing",3],["NCN21","Disaster Nursing",3],
  ["NCN22","Intensive Nursing Practicum",8],["GEC04","Contemporary World",3]
 ]}
}
};

/* ---------- AUTH / USER-SCOPED DATA ---------- */
function makeUserKey(user){
    return encodeURIComponent(String(user.studentNumber || user.username || "student").trim().toLowerCase());
}

// The logged-in user is cached locally (no password is ever stored). The real data lives in Supabase.
function getCurrentUser(){
    try {
        const u = JSON.parse(localStorage.getItem("gwaUser") || "null");
        return (u && u.studentNumber) ? u : null;
    } catch(e){ return null; }
}

function getActiveUserKey(){
    const user = getCurrentUser();
    return user ? makeUserKey(user) : "guest";
}

function getSelectedCourse(){
    return localStorage.getItem("selectedCourse_" + getActiveUserKey()) || "";
}

function setSelectedCourse(course){
    localStorage.setItem("selectedCourse_" + getActiveUserKey(), course);
    pushProfile({ selected_course: course });
}

/* ---------- CLOUD SYNC (localStorage = fast cache, Supabase = real storage) ---------- */
const syncTimers = {};
const syncPending = {};

async function currentUserId(){
    const { data } = await supa.auth.getSession();
    return data && data.session ? data.session.user.id : null;
}

async function pushSemester(course, year, semester){
    try {
        const uid = await currentUserId();
        if(!uid) return;
        const subjects = (curriculum[course] && curriculum[course][year] && curriculum[course][year][semester]) || [];
        let saved = {};
        try { saved = JSON.parse(localStorage.getItem(gradeKey(course,year,semester)) || "{}"); } catch(e) {}

        const rows = Object.keys(saved).map(i => ({
            user_id: uid,
            course: course,
            year_level: String(year),
            semester: semester,
            subject_index: Number(i),
            subject: subjects[i] ? subjects[i][1] : null,
            units: subjects[i] ? Number(subjects[i][2]) : null,
            grade: Number(saved[i])
        }));

        if(rows.length){
            const { error } = await supa.from("grades")
                .upsert(rows, { onConflict: "user_id,course,year_level,semester,subject_index" });
            if(error) throw error;
        }

        // remove grades that were cleared on the screen
        let del = supa.from("grades").delete()
            .eq("user_id", uid).eq("course", course)
            .eq("year_level", String(year)).eq("semester", semester);
        if(rows.length) del = del.not("subject_index", "in", "(" + rows.map(r => r.subject_index).join(",") + ")");
        const { error: dErr } = await del;
        if(dErr) throw dErr;
    } catch(err){
        console.error("Could not save grades online:", err);
    }
}

function scheduleGradeSync(course, year, semester){
    const k = course + "|" + year + "|" + semester;
    syncPending[k] = [course, year, semester];
    clearTimeout(syncTimers[k]);
    syncTimers[k] = setTimeout(function(){
        delete syncPending[k];
        pushSemester(course, year, semester);
    }, 500);
}

async function flushSync(){
    const jobs = Object.keys(syncPending).map(k => {
        clearTimeout(syncTimers[k]);
        const a = syncPending[k];
        delete syncPending[k];
        return pushSemester(a[0], a[1], a[2]);
    });
    await Promise.all(jobs);
}

async function pushProfile(fields){
    try {
        const uid = await currentUserId();
        if(!uid) return;
        const { error } = await supa.from("profiles").update(fields).eq("id", uid);
        if(error) throw error;
    } catch(err){
        console.error("Could not save profile online:", err);
    }
}

function clearLocalSession(){
    ["isLoggedIn","currentUserKey","gwaUser"].forEach(k => localStorage.removeItem(k));
    const remove = [];
    for(let i=0; i<localStorage.length; i++){
        const k = localStorage.key(i);
        if(k && (k.startsWith("grades_") || k.startsWith("selectedCourse_") || k.startsWith("gwaSettings_"))) remove.push(k);
    }
    remove.forEach(k => localStorage.removeItem(k));
}

// Downloads the account, grades and settings from Supabase into the local cache.
async function loadAccount(authUser){
    const { data: p, error } = await supa.from("profiles").select("*").eq("id", authUser.id).single();
    if(error || !p) return null;

    const user = { fullName: p.full_name || p.username, studentNumber: p.student_number, username: p.username };
    clearLocalSession();
    localStorage.setItem("gwaUser", JSON.stringify(user));
    const userKey = makeUserKey(user);
    localStorage.setItem("currentUserKey", userKey);

    const { data: rows } = await supa.from("grades").select("*").eq("user_id", authUser.id);
    const buckets = {};
    (rows || []).forEach(r => {
        const k = "grades_" + userKey + "_" + r.course + "_" + r.year_level + "_" + r.semester;
        (buckets[k] = buckets[k] || {})[r.subject_index] = Number(r.grade);
    });
    Object.keys(buckets).forEach(k => localStorage.setItem(k, JSON.stringify(buckets[k])));

    if(p.settings) localStorage.setItem("gwaSettings_" + userKey, JSON.stringify(p.settings));
    if(p.selected_course) localStorage.setItem("selectedCourse_" + userKey, p.selected_course);
    return user;
}

/* ================
   Account Every Student
   ================ */
function gradeKey(course,year,semester){
    return "grades_" + getActiveUserKey() + "_" + course + "_" + year + "_" + semester;
}

/* ---------- VIEW ROUTER (login / register / app in one page) ---------- */
function showView(view){
    document.querySelectorAll(".view").forEach(v => { v.hidden = v.dataset.view !== view; });
    const isApp = view === "app";
    document.body.classList.toggle("dashboard-page", isApp);
    document.body.classList.toggle("login-page", !isApp);

    if(isApp){
        initDashboard();
        initThemeToggle();
        showDashboard();
    } else {
        document.body.classList.remove("dark-mode");   // login/register are always light
        document.querySelectorAll("form").forEach(f => f.reset());
        setBackgroundLogo(null);
    }
    window.scrollTo(0, 0);
}

function goTo(url){
    showView(url === "dashboard.html" ? "app" : "login");
}

document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById("loginForm").addEventListener("submit", handleLogin);
    document.getElementById("registerForm").addEventListener("submit", handleRegister);

    document.addEventListener("click", e => {
        const link = e.target.closest("[data-goto]");
        if(!link) return;
        e.preventDefault();
        showView(link.dataset.goto);
    });

    // restore the online session (stays logged in after refresh)
    let loggedIn = false;
    try {
        const { data } = await supa.auth.getSession();
        if(data && data.session){
            const user = await loadAccount(data.session.user);
            if(user){
                localStorage.setItem("isLoggedIn", "true");
                selectedCourse = getSelectedCourse();
                loggedIn = true;
            }
        }
    } catch(err){ console.error(err); }

    if(!loggedIn) clearLocalSession();
    showView(loggedIn ? "app" : "login");
});

async function handleRegister(e){
    e.preventDefault();
    const btn = e.submitter;

    const fullName = document.getElementById("fullName").value.trim();
    const studentNumber = document.getElementById("studentNumber").value.trim();
    const username = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    if (!fullName || !studentNumber || !username || !password || !confirm) {
        alert("Please complete all fields.");
        return;
    }
    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }
    const email = toEmail(studentNumber);
    if (!email) {
        alert("Please enter a valid Student Number.");
        return;
    }

    if(btn) btn.disabled = true;
    try {
        const { data, error } = await supa.auth.signUp({ email: email, password: password });
        if(error){
            if(/registered|already/i.test(error.message)) alert("Student Number is already registered. Please log in or use a different one.");
            else alert(error.message);
            return;
        }
        if(!data.session){
            alert("Account created but email confirmation is still ON in Supabase. Turn off 'Confirm email' in Authentication > Sign In / Providers > Email.");
            return;
        }

        const { error: pErr } = await supa.from("profiles").insert({
            id: data.user.id,
            student_number: studentNumber,
            username: username,
            full_name: fullName
        });
        if(pErr){
            await supa.auth.signOut();
            alert("Could not save your profile: " + pErr.message);
            return;
        }

        await supa.auth.signOut();
        clearLocalSession();
        alert("Registration successful! You can now log in.");
        goTo("index.html");
    } catch(err){
        alert("Something went wrong. Please check your internet connection and try again.");
        console.error(err);
    } finally {
        if(btn) btn.disabled = false;
    }
}

async function handleLogin(e){
    e.preventDefault();
    const btn = e.submitter;

    const studentNumber = document.getElementById("loginStudentNumber").value.trim();
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const email = toEmail(studentNumber);

    if(!studentNumber || !username || !password){
        alert("Please complete all fields.");
        return;
    }

    if(btn) btn.disabled = true;
    try {
        const { data, error } = await supa.auth.signInWithPassword({ email: email, password: password });
        if(error){
            alert("Incorrect Student Number, Username, or Password.");
            return;
        }

        const user = await loadAccount(data.user);
        if(!user || String(user.username).toLowerCase() !== username.toLowerCase()){
            await supa.auth.signOut();
            clearLocalSession();
            alert("Incorrect Student Number, Username, or Password.");
            return;
        }

        localStorage.setItem("isLoggedIn", "true");
        selectedCourse = getSelectedCourse();
        goTo("dashboard.html");
    } catch(err){
        alert("Something went wrong. Please check your internet connection and try again.");
        console.error(err);
    } finally {
        if(btn) btn.disabled = false;
    }
}

function requireLogin(){
    const ok = getCurrentUser() && localStorage.getItem("isLoggedIn") === "true";
    if(!ok) showView("login");
    return ok;
}


/* ---------- THEME / DARK MODE ---------- */
function themeStorageKey(){
    try {
        return "gwaTheme_" + (getActiveUserKey ? getActiveUserKey() : "guest");
    } catch(e) {
        return "gwaTheme_guest";
    }
}

function updateThemeButton(){
    const btn = document.getElementById("themeToggle");
    if(!btn) return;
    const dark = document.body.classList.contains("dark-mode");
    btn.textContent = dark ? "☀ Light Mode" : "🌙 Dark Mode";
    btn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}

function initThemeToggle(){
    const saved = localStorage.getItem(themeStorageKey());
    // Light mode is the default so the colorful dashboard stays bright.
    if(saved === "dark") document.body.classList.add("dark-mode");
    else document.body.classList.remove("dark-mode");
    updateThemeButton();
}

function toggleDarkMode(){
    const dark = document.body.classList.toggle("dark-mode");
    localStorage.setItem(themeStorageKey(), dark ? "dark" : "light");
    updateThemeButton();
}

/* ---------- LOGOUT (with confirmation popup) ---------- */
function logout(){
    openLogoutConfirm();
}

async function performLogout(){
    try {
        await flushSync();          // make sure the latest grades are saved online first
        await supa.auth.signOut();
    } catch(err){ console.error(err); }
    clearLocalSession();
    goTo("index.html");
}

function openLogoutConfirm(){
    if(document.getElementById("logoutModal")) return;

    const overlay = document.createElement("div");
    overlay.id = "logoutModal";
    overlay.className = "modal-overlay";
    overlay.innerHTML = `
      <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="logoutTitle">
        <div class="modal-icon">⏻</div>
        <h3 id="logoutTitle">Log out?</h3>
        <p>Are you sure you want to log out?</p>
        <div class="modal-actions">
          <button type="button" class="modal-btn modal-cancel" id="logoutCancel">Cancel</button>
          <button type="button" class="modal-btn modal-confirm" id="logoutConfirm">Yes, log out</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    function closeModal(){
        document.removeEventListener("keydown", onKey);
        overlay.remove();
    }
    function onKey(e){
        if(e.key === "Escape") closeModal();
    }

    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", function(e){
        if(e.target === overlay) closeModal();         
    });
    document.getElementById("logoutCancel").addEventListener("click", closeModal);
    document.getElementById("logoutConfirm").addEventListener("click", function(){
        document.removeEventListener("keydown", onKey);
        overlay.remove();
        performLogout();
    });
    document.getElementById("logoutCancel").focus();     
}

/* ---------- DASHBOARD ---------- */
function initDashboard(){
    loadSettings();
    setBackgroundLogo(null);
    const raw = localStorage.getItem("gwaUser");
    if (!raw) return;

    let user;
    try { user = JSON.parse(raw); } catch(e) { return; }

    const nameEl = document.getElementById("studentName");
    const numEl = document.getElementById("studentNumberDisplay");
    if (nameEl) nameEl.textContent = user.fullName || "Student";
    if (numEl) numEl.textContent = user.studentNumber || "-";

    const menu = document.getElementById("courseMenu");
    if (!menu) return;
    menu.innerHTML = "";

    const courseColors = ["course-yellow","course-green","course-blue","course-maroon","course-pink"];

    
    COURSES.forEach((course, index) => {
        const wrap = document.createElement("div");
        wrap.className = "course-menu-item";

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "course-card " + courseColors[index % courseColors.length];
        btn.textContent = course;

        btn.addEventListener("click", function(e){
            e.preventDefault();
            e.stopPropagation();

            selectedCourse = course;
            setSelectedCourse(course);

            document.querySelectorAll(".course-card").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

           
            showCourseYears(course);
        });

        wrap.appendChild(btn);
        menu.appendChild(wrap);
    });

    renderGradesSummary();
}

/* ---------- MY GRADES (saved GWA list in the sidebar) ---------- */
function renderGradesSummary(){
    const old = document.getElementById("gradesSummary");
    if(old) old.remove();
}

function showCourseYears(course){
    const home = document.getElementById("dashboardHome");
    const content = document.getElementById("courseContent");
    if(!content) return;

    if(home) home.style.display = "none";
    content.classList.add("active");
    content.style.display = "block";

    setBackgroundLogo(course);
    const sb = document.getElementById("sidebar");
    if(sb) sb.classList.remove("show");
    const safeCourse = escapeHtml(course);
    let yearCards = "";

    for(let year=1; year<=4; year++){
        const firstCount = (curriculum[course] && curriculum[course][year] && curriculum[course][year].first || []).length;
        const secondCount = (curriculum[course] && curriculum[course][year] && curriculum[course][year].second || []).length;
        yearCards += `
          <button type="button" class="year-card ${COURSE_COLOR_CLASSES[course] || ""}" data-year="${year}">
            <strong>${["FIRST YEAR","SECOND YEAR","THIRD YEAR","FOURTH YEAR"][year-1]}</strong>
            <span>${firstCount} First Sem subjects · ${secondCount} Second Sem subjects</span>
          </button>`;
    }

    content.innerHTML = `
      <div class="course-picker">
        ${courseLogoHtml(course)}
        <h1>${safeCourse}</h1>
        <p>Select a year to view its semesters, subjects, units, and grades.</p>
        <div class="year-grid">${yearCards}</div>
      </div>
      ${honorsPanelHtml(course)}
    `;

    content.querySelectorAll(".year-card").forEach(card => {
        card.addEventListener("click", function(){
            const year = Number(card.dataset.year);
            showCourse(course, year);
        });
    });
}

function toggleMenu(){
    const sidebar = document.getElementById("sidebar");
    if(sidebar) sidebar.classList.toggle("show");
}

function toggleYear(id){
    const el = document.getElementById(id);
    if(el) el.classList.toggle("show");
}

function showDashboard(){
    setBackgroundLogo(null);
    document.getElementById("dashboardHome").style.display = "block";
    document.getElementById("courseContent").style.display = "";
    renderGradesSummary();
    const content = document.getElementById("courseContent");
    content.classList.remove("active");
    content.innerHTML = "";
}

function showCourse(course, year){
    selectedCourse = course;
    setSelectedCourse(course);

    const home = document.getElementById("dashboardHome");
    const content = document.getElementById("courseContent");
    if (!content) return;

    if (home) home.style.display = "none";
    content.classList.add("active");
    content.style.display = "block";

    setBackgroundLogo(course);
    const safeCourse = escapeHtml(course);

    content.innerHTML = `
      <div class="course-header ${COURSE_COLOR_CLASSES[course] || ""}">
        ${courseLogoHtml(course)}
        <h1>${safeCourse}</h1>
        <p>Year ${year}</p>
      </div>

      <div class="semester-tabs" id="semesterTabs">
        <button id="firstSemesterBtn" class="semester-btn active" type="button">FIRST SEMESTER</button>
        <button id="secondSemesterBtn" class="semester-btn" type="button">SECOND SEMESTER</button>
      </div>

      <div id="semesterArea"></div>
    `;

    const firstBtn = document.getElementById("firstSemesterBtn");
    const secondBtn = document.getElementById("secondSemesterBtn");

    firstBtn.addEventListener("click", function(){
        showSemester(course, year, "first", firstBtn);
    });

    secondBtn.addEventListener("click", function(){
        showSemester(course, year, "second", secondBtn);
    });

    
    showSemester(course, year, "first", firstBtn);
/* ================
     On mobile, close the sidebar after selecting a course.
   ================ */
    
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("show");
}

/* ---------- GRADE DROPDOWN ---------- */
const GRADE_CHOICES = ["1.00","1.25","1.50","1.75","2.00","2.25","2.50","2.75","3","4","5"];

function gradeSelectHtml(i, saved){
    const savedNum = parseFloat(saved);
    const hasSaved = Number.isFinite(savedNum);
    const list = GRADE_CHOICES.slice();
    // keep an older saved grade that is not in the list, so it is not lost
    if(hasSaved && !list.some(g => parseFloat(g) === savedNum)) list.push(String(savedNum));
    const options = list.map(g =>
        `<option value="${g}"${hasSaved && parseFloat(g) === savedNum ? " selected" : ""}>${g}</option>`
    ).join("");
    return `<select class="grade-input" id="grade-${i}" aria-label="Grade"><option value=""${hasSaved ? "" : " selected"}>—</option>${options}</select>`;
}

function showSemester(course, year, semester, btn){
    document.querySelectorAll(".semester-btn").forEach(b=>b.classList.remove("active"));
    if(btn) btn.classList.add("active");

    const subjects = (curriculum[course] && curriculum[course][year] && curriculum[course][year][semester]) || [];
    const area = document.getElementById("semesterArea");
    if (!area) return;

    if(!subjects.length){
        area.innerHTML = `<div class="gwa-result"><h2>No subjects found</h2><p>Please check the curriculum data.</p></div>`;
        return;
    }

    const key = gradeKey(course,year,semester);
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(key) || "{}"); } catch(e) { saved = {}; }

    let rows = "";
    subjects.forEach((s,i)=>{
        const grade = saved[i] ?? "";
        rows += `
        <tr>
          <td>${escapeHtml(s[0])}</td>
          <td>${escapeHtml(s[1])}</td>
          <td>${s[2]}</td>
          <td>${gradeSelectHtml(i, grade)}</td>
        </tr>`;
    });

    area.innerHTML = `
      <p class="grade-hint">Choose a grade for each subject. The GWA and the Dean's Lister status appear automatically. Leave the Grade box on — for a subject you do not want to include.</p>
      <div class="table-container">
        <table class="subject-table">
          <thead><tr><th>Code</th><th>Subject</th><th>Units</th><th>Grade</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="actions">
        <button id="saveBtn" class="action-btn" type="button">SAVE GWA</button>
        <button id="printBtn" class="action-btn" type="button">PRINT</button>
      </div>
      <div id="gwaResult" class="gwa-result" style="display:none"></div>
    `;

    
    // Saves the grades and shows the semester GWA, the Dean's Lister status and the total GWA.
    // Nothing is shown (and no message appears) while no grade is chosen.
    function liveCompute(scrollToResult){
        autoSaveSemester(course,year,semester);
        const box = document.getElementById("gwaResult");
        if(computeSemesterOnlyFromInputs(course,year,semester)){
            updateTotalGWA(course,year,semester);
            if(scrollToResult && box) setTimeout(function(){ box.scrollIntoView({behavior:"smooth", block:"start"}); }, 60);
        } else if(box){
            box.style.display = "none";
            box.innerHTML = "";
        }
    }

    document.getElementById("saveBtn").addEventListener("click", function(){
        const saveBtn = this;
        const result = saveSemesterGrades(course,year,semester,false);   
        if(result){
            updateTotalGWA(course,year,semester);
            const old = saveBtn.textContent;
            saveBtn.textContent = "SAVED ✓";
            setTimeout(function(){ saveBtn.textContent = old; }, 1200);
        }
    });

    const gradeInputs = Array.from(area.querySelectorAll(".grade-input"));
    gradeInputs.forEach(function(sel, idx){
        // every time a grade is chosen, the GWA and the Dean's Lister status update by themselves
        sel.addEventListener("change", function(){ liveCompute(false); });

        sel.addEventListener("keydown", function(e){
            if(e.key === "Enter"){
                e.preventDefault();
                const next = gradeInputs[idx + 1];
                if(next) next.focus();
                else liveCompute(true);         // Enter on the last box also jumps to the result
            }
        });
    });

    document.getElementById("printBtn").addEventListener("click", function(){
        printSemester(course,year,semester);
    });
/* ================
     Show saved semester GWA and total GWA when saved grades exist.
   ================ */
    if(Object.keys(saved).length) {
        const semResult = computeSemesterGWA(course,year,semester,false);
        if(semResult) updateTotalGWA(course,year,semester);
    }
}

function updateTotalGWA(course,year,currentSemester){
    const result = document.getElementById("gwaResult");
    if(!result) return;
/* ================
       Save the currently visible semester temporarily in memory only so the
     total GWA can include grades the student just entered, even before SAVE.
   ================ */
    const subjects = curriculum[course][year][currentSemester] || [];
    const current = {};
    subjects.forEach((s,i)=>{
        const g = parseFloat(document.getElementById("grade-"+i)?.value);
        if(Number.isFinite(g) && g >= 1 && g <= 5) current[i]=g;
    });

    let weighted=0, units=0;
    for(let y=1;y<=4;y++){
        for(const sem of ["first","second"]){
            const subs = (curriculum[course][y] && curriculum[course][y][sem]) || [];
            let saved={};
            try { saved=JSON.parse(localStorage.getItem(gradeKey(course,y,sem))||"{}"); } catch(e) {}

            subs.forEach((s,i)=>{
                // the semester on the screen uses what is typed now; the others use saved grades
                const g = (y===year && sem===currentSemester) ? current[i] : parseFloat(saved[i]);
                if(Number.isFinite(g) && g>=1 && g<=5){
                    weighted += g * Number(s[2]);
                    units += Number(s[2]);
                }
            });
        }
    }

    const total = units ? weighted / units : null;
    const sem = computeSemesterOnlyFromInputs(course,year,currentSemester);

    if(sem){
        result.style.display="block";
        result.innerHTML = `
          <h2>GWA RESULT</h2>
          <p>Semester Units: <strong>${sem.units}</strong></p>
          <p>Semester GWA: <strong>${sem.gwa.toFixed(2)}</strong></p>
          <p class="dl-status ${sem.gwa <= DEANS_LIST_MAX ? 'dl-yes' : 'dl-no'}">${sem.gwa <= DEANS_LIST_MAX ? "\u{1F3C5} DEAN'S LISTER" : "NOT ELIGIBLE"}</p>
          ${total !== null ? `<hr><p>Total Units (all saved/entered): <strong>${units}</strong></p><p class="total-label">TOTAL GWA</p><div class="gwa-number">${total.toFixed(2)}</div>` : ""}
        `;
    }
}

function computeSemesterOnlyFromInputs(course,year,semester){
    const subjects = curriculum[course][year][semester] || [];
    let units=0, weighted=0;
    for(let i=0;i<subjects.length;i++){
        const raw = String(document.getElementById("grade-"+i)?.value ?? "").trim();
        if(raw === "") continue;                       
        const g=parseFloat(raw);
        if(!Number.isFinite(g) || g<1 || g>5) return null;
        units += Number(subjects[i][2]);
        weighted += g * Number(subjects[i][2]);
    }
    return units ? {gwa:weighted/units,units,weighted} : null;
}


function getSemesterValues(course,year,semester){
    const allSubjects = curriculum[course][year][semester];
    const subjects = [], grades = [], indexes = [];
    for(let i=0;i<allSubjects.length;i++){
        const input = document.getElementById("grade-"+i);
        const raw = input ? String(input.value).trim() : "";
        if(raw === "") continue;
        const grade = parseFloat(raw);
        if(!Number.isFinite(grade) || grade < 1 || grade > 5){
            return {error:`Please enter a valid grade from 1.00 to 5.00 for ${allSubjects[i][1]}, or leave it empty.`};
        }
        subjects.push(allSubjects[i]);
        grades.push(grade);
        indexes.push(i);
    }
    if(!subjects.length) return {error:"Please enter at least one grade."};
    return {subjects,grades,indexes};
}
function autoSaveSemester(course,year,semester){
    const all = (curriculum[course] && curriculum[course][year] && curriculum[course][year][semester]) || [];
    const saved = {};
    for(let i=0;i<all.length;i++){
        const el = document.getElementById("grade-"+i);
        if(!el) return;                               
        const g = parseFloat(String(el.value).trim());
        if(Number.isFinite(g) && g >= 1 && g <= 5) saved[i] = g;
    }
    const key = gradeKey(course,year,semester);
    if(Object.keys(saved).length) localStorage.setItem(key, JSON.stringify(saved));
    else localStorage.removeItem(key);
    scheduleGradeSync(course,year,semester);
}

function saveSemesterGrades(course,year,semester,showAlert=false){
    const data = getSemesterValues(course,year,semester);
    if(data.error){ alert(data.error); return false; }

    const saved = {};
    data.indexes.forEach((idx,k)=>saved[idx]=data.grades[k]);
    localStorage.setItem(gradeKey(course,year,semester),JSON.stringify(saved));
    pushSemester(course,year,semester);
    renderGradesSummary();
    if(showAlert) alert("GWA saved successfully.");
    return true;
}

function computeSemesterGWA(course,year,semester,showAlert=true){
    const data = getSemesterValues(course,year,semester);
    if(data.error){ alert(data.error); return null; }

    let units=0, weighted=0;
    data.subjects.forEach((s,i)=>{
        units += Number(s[2]);
        weighted += data.grades[i] * Number(s[2]);
    });

    const gwa = weighted / units;
    const result = document.getElementById("gwaResult");

    if(result){
        result.style.display="block";
        result.innerHTML = `
          <h2>SEMESTER GWA</h2>
          <p>Total Units: <strong>${units}</strong></p>
          <p>Weighted Grades: <strong>${weighted.toFixed(2)}</strong></p>
          <div class="gwa-number">${gwa.toFixed(2)}</div>
        `;
    }
    if(showAlert){
     /* ================
       // Compute only; SAVE GWA is handled by the dedicated button.
   ================ */  
    }
    return {gwa,units,weighted};
}
/* ================
      Computes a year using all entered grades from both semesters.
   This is weighted by units, not a simple average of semester GWAs. 
   ================ */
function getYearGWA(course,year){
    let weighted=0, units=0, hasGrades=false;

    ["first","second"].forEach(sem=>{
        const subjects = curriculum[course][year][sem] || [];
        const saved = JSON.parse(localStorage.getItem(gradeKey(course,year,sem)) || "{}");

        subjects.forEach((s,i)=>{
            const g = parseFloat(saved[i]);
            if(Number.isFinite(g)){
                hasGrades=true;
                weighted += g * Number(s[2]);
                units += Number(s[2]);
            }
        });
    });

    return hasGrades ? {gwa:weighted/units,units,weighted} : null;
}

function getOverallGWA(course){
    let weighted=0, units=0, hasGrades=false;

    for(let year=1;year<=4;year++){
        const r = getYearGWA(course,year);
        if(r){
            hasGrades=true;
            weighted += r.weighted;
            units += r.units;
        }
    }

    return hasGrades ? {gwa:weighted/units,units,weighted} : null;
}


/* ---------- LATIN HONORS ---------- */
const LATIN_HONORS = [
  { name:"Summa Cum Laude", max:1.20, lowest:2.00 },
  { name:"Magna Cum Laude", max:1.40, lowest:2.00 },
  { name:"Cum Laude",       max:1.60, lowest:2.50 }
];

function getCourseGradeStats(course){
    let weighted=0, units=0, totalUnits=0, lowest=null;
    const years=[];
    for(let y=1;y<=4;y++){
        let yw=0, yu=0, yTotal=0;
        ["first","second"].forEach(sem=>{
            const subs=(curriculum[course] && curriculum[course][y] && curriculum[course][y][sem]) || [];
            let saved={};
            try{ saved=JSON.parse(localStorage.getItem(gradeKey(course,y,sem))||"{}"); }catch(e){}
            subs.forEach((s,i)=>{
                const u=Number(s[2]);
                yTotal+=u;
                const g=parseFloat(saved[i]);
                if(Number.isFinite(g) && g>=1 && g<=5){
                    yw+=g*u; yu+=u;
                    if(lowest===null || g>lowest) lowest=g;
                }
            });
        });
        years.push({year:y, gwa: yu? yw/yu : null, units:yu, totalUnits:yTotal});
        weighted+=yw; units+=yu; totalUnits+=yTotal;
    }
    return {years, gwa: units? weighted/units : null, units, totalUnits, lowest};
}

function honorsPanelHtml(course){
    const st=getCourseGradeStats(course);
    const names=["FIRST YEAR","SECOND YEAR","THIRD YEAR","FOURTH YEAR"];

    const yearBoxes=st.years.map((r,i)=>`
      <div class="honor-year">
        <small>${names[i]}</small>
        <b>${r.gwa!==null ? r.gwa.toFixed(2) : "—"}</b>
        <span>${r.units} / ${r.totalUnits} units graded</span>
      </div>`).join("");

    let badge="", msg="";
    if(st.gwa===null){
        badge='<div class="honor-badge none">NO SAVED GRADES YET</div>';
        msg="Open a year, enter your grades, and press SAVE GWA. Your overall GWA and Latin honors standing will appear here.";
    } else {
        // highest honor whose GWA limit AND lowest-grade limit are both met
        const earned = LATIN_HONORS.find(h => st.gwa <= h.max + 1e-9 && (st.lowest===null || st.lowest <= h.lowest + 1e-9));
        // GWA is good enough for some honor, but the lowest grade is too low for all of them
        const inRange = LATIN_HONORS.find(h => st.gwa <= h.max + 1e-9);
        if(earned){
            badge=`<div class="honor-badge yes">🎓 ${earned.name.toUpperCase()}</div>`;
            msg=`Your overall GWA of ${st.gwa.toFixed(2)} and your lowest grade of ${st.lowest.toFixed(2)} meet the ${earned.name} requirements (GWA ${earned.max.toFixed(2)} or better, no grade lower than ${earned.lowest.toFixed(2)}).`;
        } else if(inRange){
            badge='<div class="honor-badge no">NOT ELIGIBLE (LOWEST GRADE)</div>';
            msg=`Your GWA is within range, but your lowest grade is ${st.lowest.toFixed(2)}. Lowest grade allowed: ${LATIN_HONORS.map(h=>h.name+" "+h.lowest.toFixed(2)).join(", ")}.`;
        } else {
            badge='<div class="honor-badge no">NOT YET WITHIN LATIN HONORS</div>';
            msg=`You need an overall GWA of ${LATIN_HONORS[LATIN_HONORS.length-1].max.toFixed(2)} or better for Cum Laude. Your current GWA is ${st.gwa.toFixed(2)}.`;
        }
        if(st.units < st.totalUnits) msg += ` (Based on ${st.units} of ${st.totalUnits} units graded so far.)`;
    }

    const ranges=LATIN_HONORS.map(h=>`<span>${h.name}: ≤ ${h.max.toFixed(2)} · lowest grade ${h.lowest.toFixed(2)}</span>`).join("");

    return `
      <div class="honors-card">
        <h2>OVERALL GRADES &amp; LATIN HONORS</h2>
        <div class="honor-years">${yearBoxes}</div>
        <div class="honor-overall">
          <div class="honor-total"><small>OVERALL GWA</small><b>${st.gwa!==null ? st.gwa.toFixed(2) : "—"}</b></div>
          <div class="honor-status">${badge}<p>${msg}</p></div>
        </div>
        <div class="honor-ranges">${ranges}</div>
      </div>`;
}


/* ================
   SETTINGS: Dean's Lister limit (every semester) and Latin honors limits
   ================ */
const DEFAULT_SETTINGS = {
    deansList: 2.00,
    latin: [ {max:1.20, lowest:2.00}, {max:1.40, lowest:2.00}, {max:1.75, lowest:2.50} ]
};
function settingsKey(){ return "gwaSettings_" + getActiveUserKey(); }

function loadSettings(){
    let s = null;
    try { s = JSON.parse(localStorage.getItem(settingsKey()) || "null"); } catch(e) { s = null; }
    const ok = v => Number.isFinite(v) && v >= 1 && v <= 5;
    DEANS_LIST_MAX = (s && ok(s.deansList)) ? s.deansList : DEFAULT_SETTINGS.deansList;
    LATIN_HONORS.forEach(function(h,i){
        const d = DEFAULT_SETTINGS.latin[i];
        const v = s && s.latin && s.latin[i];
        h.max    = (v && ok(v.max))    ? v.max    : d.max;
        h.lowest = (v && ok(v.lowest)) ? v.lowest : d.lowest;
    });
}

function showSettings(){
    loadSettings();
    setBackgroundLogo(null);
    const sb = document.getElementById("sidebar");
    if(sb) sb.classList.remove("show");
    const home = document.getElementById("dashboardHome");
    const content = document.getElementById("courseContent");
    if(home) home.style.display = "none";
    if(!content) return;
    content.classList.add("active");
    content.style.display = "block";

    const num = (id,val) => `<input class="settings-input" id="${id}" type="number" inputmode="decimal" step="0.01" min="1" max="5" value="${Number(val).toFixed(2)}">`;
    const honorRows = LATIN_HONORS.map((h,i)=>`
        <tr>
          <td>${h.name}</td>
          <td>${num("set-max-"+i, h.max)}</td>
          <td>${num("set-low-"+i, h.lowest)}</td>
        </tr>`).join("");

    content.innerHTML = `
      <div class="settings-card">
        <div class="about-icon">\u2699</div>
        <h1>SETTINGS</h1>
        <p class="about-lead">Update the grade limits used by the system</p>

        <h2>DEAN'S LISTER (EVERY SEMESTER)</h2>
        <p>The semester GWA must be this value or better to be a Dean's Lister. Lower is better.</p>
        <div class="settings-row"><label for="set-dl">Highest semester GWA allowed</label>${num("set-dl", DEANS_LIST_MAX)}</div>

        <h2>LATIN HONORS</h2>
        <p>The overall GWA must be the limit or better, and no grade may be lower than the lowest grade allowed.</p>
        <div class="table-container">
          <table class="subject-table settings-table">
            <thead><tr><th>Honor</th><th>GWA limit</th><th>Lowest grade allowed</th></tr></thead>
            <tbody>${honorRows}</tbody>
          </table>
        </div>

        <div class="actions">
          <button id="saveSettingsBtn" class="action-btn" type="button">SAVE SETTINGS</button>
        </div>
        <p class="settings-note">These are guides only. Confirm the official requirements with the registrar. The settings are saved to your account online.</p>
      </div>`;

    document.getElementById("saveSettingsBtn").addEventListener("click", function(){
        const btn = this;
        const read = id => parseFloat(document.getElementById(id).value);
        const dl = read("set-dl");
        const latin = LATIN_HONORS.map((h,i)=>({max:read("set-max-"+i), lowest:read("set-low-"+i)}));
        const ok = v => Number.isFinite(v) && v >= 1 && v <= 5;
        if(!ok(dl) || latin.some(l => !ok(l.max) || !ok(l.lowest))){
            alert("Every value must be a number from 1.00 to 5.00.");
            return;
        }
        if(!(latin[0].max <= latin[1].max && latin[1].max <= latin[2].max)){
            alert("The GWA limits must go from the strictest to the easiest: Summa Cum Laude, then Magna Cum Laude, then Cum Laude.");
            return;
        }
        localStorage.setItem(settingsKey(), JSON.stringify({deansList:dl, latin:latin}));
        pushProfile({ settings: {deansList:dl, latin:latin} });
        loadSettings();
        renderGradesSummary();
        const old = btn.textContent;
        btn.textContent = "SAVED \u2713";
        setTimeout(function(){ btn.textContent = old; }, 1200);
    });

    document.getElementById("resetSettingsBtn").addEventListener("click", function(){
        localStorage.removeItem(settingsKey());
        pushProfile({ settings: null });
        showSettings();
    });
}

function showAboutSystem(){
    setBackgroundLogo(null);
    const home=document.getElementById("dashboardHome");
    const content=document.getElementById("courseContent");
    if(home) home.style.display="none";
    if(!content) return;
    content.classList.add("active");
    content.style.display="block";
    content.innerHTML=`
      <div class="about-system-card">
        <div class="about-icon">ⓘ</div>
        <h1>ABOUT SYSTEM</h1>
        <p class="about-lead">GWA Calculator Student System</p>
        <p>This system helps students record their subject grades, calculate their General Weighted Average (GWA), save grade records, and print their academic results.</p>
        <div class="about-grid">
          <div><strong>COURSE</strong><span>Select your course first.</span></div>
          <div><strong>YEAR</strong><span>Choose First Year to Fourth Year.</span></div>
          <div><strong>SEMESTER</strong><span>View First or Second Semester subjects.</span></div>
          <div><strong>GWA</strong><span>Compute and save your weighted average.</span></div>
        </div>
        <div class="credentials-card">
          <div class="credentials-title">CREDENTIALS</div>
          <div class="credentials-subtitle">PROJECT MEMBERS</div>
          <div class="credentials-list">
            ${PROJECT_MEMBERS.map(m => `
            <div class="credential-item">
              <span class="member-avatar" data-initials="${escapeHtml(memberInitials(m.name))}">
                <img class="member-photo" data-base="photos/${m.photo}" alt="${escapeHtml(m.name)}">
              </span>
              <div class="member-info">
                <strong>${escapeHtml(m.name)}</strong>
                <em class="member-role">${escapeHtml(m.role || "")}</em>
                <small class="member-task">${escapeHtml(m.task || "")}</small>
              </div>
            </div>`).join("")}
          </div>
          <div class="credentials-subtitle instructor-title">INSTRUCTOR</div>
          <div class="credentials-list">
            <div class="credential-item">
              <span class="member-avatar" data-initials="${escapeHtml(memberInitials(INSTRUCTOR.name))}">
                <img class="member-photo" data-base="photos/${INSTRUCTOR.photo}" alt="${escapeHtml(INSTRUCTOR.name)}">
              </span>
              <strong>${escapeHtml(INSTRUCTOR.name)}</strong>
            </div>
          </div>
          <div class="credentials-info">
            <div class="info-wide"><strong>PROJECT</strong><span>GWA Calculator Student System</span></div>
            <div><strong>SUBJECT</strong><span>CPT10 – Offline Web Application Project</span></div>
            <div><strong>SCHOOL</strong><span class="school-with-logo"><img class="school-mini-logo" src="school-logo.png" alt="School logo" onerror="this.style.display='none'">Southern Luzon State University - Gumaca Campus</span></div>
          </div>
        </div>
        <div class="about-note">Developed for student academic record and GWA computation.</div>
        <div class="about-copyright">© 2026 Team CUTE. All rights reserved.</div>
      </div>`;
    setupMemberPhotos(content);
}

/* ---------- PROJECT MEMBERS (photos are in the "photos" folder) ----------
    */
const INSTRUCTOR = { name: "Ian Titus F. Ramones", photo: "instructor" };

const PROJECT_MEMBERS = [
    { name: "Romeo Timoteo",       photo: "romeo",   role: "Programmer",
      },  
    { name: "Andrea Jane Reblora", photo: "andrea",  role: "UI Designer",      
       },
    { name: "Jayrenz Leonidas",    photo: "jayrenz", role: "Researcher",     
       },
    { name: "Renmuel Daya",        photo: "renmuel", role: "Documentator",            
       },
    { name: "Carl Aldred Ravino",  photo: "carl",    role: "System Planner",         
      }
];

function memberInitials(name){
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length-1][0] : "")).toUpperCase();
}

function setupMemberPhotos(root){
    const extensions = [".jpg", ".jpeg", ".png", ".webp"];
    root.querySelectorAll(".member-photo").forEach(img => {
        let k = 0;
        function tryNext(){
            if(k >= extensions.length){ img.classList.remove("loaded"); return; }  
            img.src = img.dataset.base + extensions[k++];
        }
        img.addEventListener("load", () => img.classList.add("loaded"));
        img.addEventListener("error", tryNext);
        tryNext();
    });
}

/* ---------- PRINT ---------- */
function printSemester(course,year,semester){
    const data=getSemesterValues(course,year,semester);
    if(data.error){ alert(data.error); return; }

    saveSemesterGrades(course,year,semester);

    const user=getCurrentUser() || {};
    let units=0,weighted=0;
    let rows="";

    data.subjects.forEach((s,i)=>{
        units += Number(s[2]);
        weighted += data.grades[i]*Number(s[2]);
        rows += `<tr><td>${s[0]}</td><td>${s[1]}</td><td>${s[2]}</td><td>${data.grades[i].toFixed(2)}</td></tr>`;
    });

    const gwa=(weighted/units).toFixed(2);
    const semName=semester==="first"?"First Semester":"Second Semester";
    const logoUrl=new URL("school-logo.png", window.location.href).href;

    const w=window.open("","_blank","width=900,height=700");
    if(!w){ alert("Please allow pop-ups to print."); return; }

    w.document.write(`
      <!DOCTYPE html><html><head><title>GWA - ${course}</title>
      <style>
        *{font-family:"Courier New",Courier,monospace}
        body{color:#111;padding:35px;font-size:14px;-webkit-print-color-adjust:exact;print-color-adjust:exact}
        .school{display:flex;align-items:center;justify-content:center;gap:16px;padding-bottom:14px;border-bottom:3px solid #0f5415}
        .school img{width:80px;height:80px;object-fit:contain}
        .school-text{text-align:left}
        .school-name{font-size:20px;font-weight:bold;color:#0f5415;letter-spacing:.5px}
        .school-campus{font-size:14px;margin-top:2px}
        .report-title{text-align:center;font-size:16px;font-weight:bold;margin:18px 0 2px}
        .report-sem{text-align:center;font-size:14px;margin-bottom:0}
        .info{border:1px solid #333;padding:12px;margin:18px 0;line-height:1.6}
        table{width:100%;border-collapse:collapse}
        th,td{border:1px solid #333;padding:9px;font-size:14px}
        th{background:#e3f1e5}
        .result{margin-top:20px;border:2px solid #111;padding:14px 18px}
        .result table{border-collapse:collapse;width:auto}
        .result td{border:0;padding:3px 0;font-size:16px;font-weight:bold}
        .result td:first-child{padding-right:18px}
        @media print{button{display:none}}
      </style></head><body>
      <div class="school">
        <img id="slsuLogo" src="${logoUrl}" alt="SLSU logo">
        <div class="school-text">
          <div class="school-name">SOUTHERN LUZON STATE UNIVERSITY</div>
          <div class="school-campus">Gumaca Campus</div>
        </div>
      </div>
      <div class="report-title">GWA CALCULATOR – GRADE REPORT</div>
      <div class="report-sem">${semName}</div>
      <div class="info">
        <b>Student Name:</b> ${escapeHtml(user.fullName||"")}<br>
        <b>Student Number:</b> ${escapeHtml(user.studentNumber||"")}<br>
        <b>Course:</b> ${escapeHtml(course)}<br>
        <b>Year:</b> ${year}
      </div>
      <table><thead><tr><th>Code</th><th>Subject</th><th>Units</th><th>Grade</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="result">
        <table>
          <tr><td>Total Units:</td><td>${units}</td></tr>
          <tr><td>Weighted Grades:</td><td>${weighted.toFixed(2)}</td></tr>
          <tr><td>Semester GWA:</td><td>${gwa}</td></tr>
        </table>
      </div>
      <p>Printed: ${new Date().toLocaleString()}</p>
      <button onclick="window.print()">PRINT</button>
      </body></html>
    `);
    w.document.close();
    w.focus();

    let printed=false;
    const doPrint=()=>{ if(printed) return; printed=true; w.focus(); w.print(); };
    const logo=w.document.getElementById("slsuLogo");
    if(logo && !logo.complete){
        logo.onload=doPrint;
        logo.onerror=doPrint;
        setTimeout(doPrint,2000);
    } else {
        setTimeout(doPrint,300);
    }
}

function escapeHtml(value){
    return String(value).replace(/[&<>"']/g,c=>({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
    }[c]));
}



(function installCenteredAlerts(){
  if (window.__centeredAlertsInstalled) return;
  window.__centeredAlertsInstalled = true;
  const nativeAlert = window.alert.bind(window);
  window.alert = function(message){
    try {
      const old = document.querySelector('.app-alert-overlay');
      if (old) old.remove();
      const overlay = document.createElement('div');
      overlay.className = 'app-alert-overlay';
      overlay.setAttribute('role','presentation');
      const card = document.createElement('section');
      card.className = 'app-alert-card';
      card.setAttribute('role','alertdialog');
      card.setAttribute('aria-modal','true');
      card.setAttribute('aria-labelledby','appAlertTitle');
      const icon = document.createElement('div');
      icon.className = 'app-alert-icon';
      icon.setAttribute('aria-hidden','true');
      icon.textContent = '!';
      const title = document.createElement('h2');
      title.id = 'appAlertTitle';
      title.textContent = 'Notice';
      const text = document.createElement('p');
      text.textContent = String(message == null ? '' : message);
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = 'OK';
      const close = function(){ overlay.remove(); };
      button.addEventListener('click', close);
      overlay.addEventListener('click', function(e){ if(e.target === overlay) close(); });
      const keyHandler = function(e){ if(e.key === 'Escape' || e.key === 'Enter'){ close(); document.removeEventListener('keydown',keyHandler); } };
      button.addEventListener('click', function(){ document.removeEventListener('keydown',keyHandler); });
      document.addEventListener('keydown',keyHandler);
      card.append(icon,title,text,button);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
      button.focus();
    } catch(err) {
      nativeAlert(message);
    }
  };
})();
