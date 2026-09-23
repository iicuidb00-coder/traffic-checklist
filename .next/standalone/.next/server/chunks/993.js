exports.id=993,exports.ids=[993],exports.modules={5094:()=>{},8458:(e,a,l)=>{Promise.resolve().then(l.t.bind(l,2994,23)),Promise.resolve().then(l.t.bind(l,6114,23)),Promise.resolve().then(l.t.bind(l,9727,23)),Promise.resolve().then(l.t.bind(l,9671,23)),Promise.resolve().then(l.t.bind(l,1868,23)),Promise.resolve().then(l.t.bind(l,4759,23))},8633:(e,a,l)=>{"use strict";l.d(a,{default:()=>n});var i=l(326),t=l(434),o=l(5047),r=l(7577),s=l(6260);function n({role:e,churchId:a}){let l=(0,o.usePathname)(),[n,c]=(0,r.useState)(!1),d="admin"===e||"manager"===e;return(0,i.jsxs)("aside",{className:"sidebar",children:[(0,i.jsxs)("div",{className:"brand",children:[i.jsx("div",{className:"brand-mark",style:{width:28,height:28},children:i.jsx("div",{style:{width:28,height:28,background:"var(--accent)",borderRadius:7,display:"grid",placeItems:"center"},children:i.jsx("span",{style:{color:"#fff",fontWeight:800,fontSize:14},children:"교"})})}),(0,i.jsxs)("div",{children:[i.jsx("div",{className:"brand-name",children:"베드로 지파"}),i.jsx("div",{className:"brand-sub",children:"교통과 체크리스트"})]})]}),(0,i.jsxs)("nav",{className:"nav",children:[(0,i.jsxs)(t.default,{href:"/",className:`nav-item${"/"===l?" active":""}`,children:[(0,i.jsxs)("svg",{className:"ic",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[i.jsx("rect",{x:"1",y:"1",width:"6",height:"6",rx:"1.5"}),i.jsx("rect",{x:"9",y:"1",width:"6",height:"6",rx:"1.5"}),i.jsx("rect",{x:"1",y:"9",width:"6",height:"6",rx:"1.5"}),i.jsx("rect",{x:"9",y:"9",width:"6",height:"6",rx:"1.5"})]}),"전체 대시보드"]}),d&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("button",{onClick:()=>c(e=>!e),className:"nav-item",style:{width:"100%",background:"none",border:"none",cursor:"pointer",textAlign:"left"},children:[(0,i.jsxs)("svg",{className:"ic",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[i.jsx("path",{d:"M2 12V6l6-4 6 4v6"}),i.jsx("path",{d:"M6 12V9h4v3"})]}),"교회별 대시보드",i.jsx("span",{style:{marginLeft:"auto",fontSize:10,opacity:.5},children:n?"▲":"▼"})]}),n&&i.jsx("div",{style:{paddingLeft:12},children:s.q6.map(e=>i.jsx(t.default,{href:`/dashboard/${e.code}`,className:`nav-item${l===`/dashboard/${e.code}`?" active":""}`,style:{fontSize:12},children:e.name},e.code))})]}),i.jsx("div",{className:"nav-label",children:"체크리스트"}),(0,i.jsxs)(t.default,{href:"/checklist",className:`nav-item${"/checklist"===l?" active":""}`,children:[(0,i.jsxs)("svg",{className:"ic",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[i.jsx("rect",{x:"2",y:"2",width:"12",height:"12",rx:"2"}),i.jsx("path",{d:"M5 8l2 2 4-4"})]}),"이번 달 체크리스트"]}),d&&(0,i.jsxs)(i.Fragment,{children:[i.jsx("div",{className:"nav-label",children:"교회별 관리"}),s.q6.map(e=>i.jsx(t.default,{href:`/checklist/${e.code}`,className:`nav-item${l===`/checklist/${e.code}`?" active":""}`,style:{fontSize:12},children:e.name},e.code))]}),d&&(0,i.jsxs)(i.Fragment,{children:[i.jsx("div",{className:"nav-label",children:"설정"}),(0,i.jsxs)(t.default,{href:"/admin",className:`nav-item${"/admin"===l?" active":""}`,children:[(0,i.jsxs)("svg",{className:"ic",viewBox:"0 0 16 16",fill:"none",stroke:"currentColor",strokeWidth:"1.5",children:[i.jsx("circle",{cx:"8",cy:"6",r:"3"}),i.jsx("path",{d:"M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"})]}),"사용자 관리"]})]})]}),(0,i.jsxs)("div",{className:"sidebar-foot",children:[i.jsx("div",{className:"avatar",children:"관"}),(0,i.jsxs)("div",{children:[i.jsx("div",{className:"who-name",children:"관리자"}),i.jsx("div",{className:"who-role",children:"베드로 지파"})]}),i.jsx("form",{action:"/api/auth/logout",method:"POST",style:{marginLeft:"auto"},children:i.jsx("button",{type:"submit",style:{background:"none",border:"none",cursor:"pointer",color:"#727c8b",fontSize:11},children:"로그아웃"})})]})]})}},6260:(e,a,l)=>{"use strict";l.d(a,{Q4:()=>s,T_:()=>r,aP:()=>o,q6:()=>i,rF:()=>t});let i=[{code:"gwangju",name:"광주"},{code:"mokpo",name:"목포"},{code:"yeosu",name:"여수"},{code:"suncheon",name:"순천"},{code:"songha",name:"송하"},{code:"gwangyang",name:"광양"},{code:"haenam",name:"해남"},{code:"naju",name:"나주"}],t=[{code:"event_support",name:"행사시 교통업무 지원",id:1},{code:"org_operation",name:"상시조직 구성 및 운영",id:2},{code:"vehicle_mgmt",name:"차량 및 주차장 관리",id:3},{code:"church_support",name:"지교회 업무지원 / 부서원 충원 및 신앙관리",id:4}],o=[{key:"achieveTypeSchedule",label:"계획준수"},{key:"achieveTypeIntensive",label:"단기집중"},{key:"achieveTypeHabit",label:"습관기반"},{key:"achieveTypeRole",label:"역할분담"}],r=[{key:"goal_error",label:"목표설정 오류"},{key:"no_plan",label:"계획부재"},{key:"lack_execution",label:"실행력 부족"},{key:"poor_mgmt",label:"점검관리 미흡"},{key:"env_fail",label:"환경변수 대응실패"},{key:"communication",label:"소통단절"}],s=[{key:"failDetailGoalVague",group:"goal_error",label:"목표모호"},{key:"failDetailGoalUnrealistic",group:"goal_error",label:"현실성없는목표"},{key:"failDetailGoalPriority",group:"goal_error",label:"우선순위 불명확"},{key:"failDetailNoSchedule",group:"no_plan",label:"일정표 없음"},{key:"failDetailNoStepPlan",group:"no_plan",label:"단계별 실행계획 없음"},{key:"failDetailNoAssignee",group:"no_plan",label:"담당자 미지정"},{key:"failDetailWorkCondition",group:"lack_execution",label:"직장여건"},{key:"failDetailTimeShort",group:"lack_execution",label:"실행시간부족"},{key:"failDetailNoRepeat",group:"lack_execution",label:"반복실행실패"},{key:"failDetailLostMotivation",group:"lack_execution",label:"초기의욕 후 급감"},{key:"failDetailPostpone",group:"lack_execution",label:"다음으로 미룸"},{key:"failDetailNoMidCheck",group:"poor_mgmt",label:"중간점검안됨"},{key:"failDetailLateResponse",group:"poor_mgmt",label:"문제발생후대응지연"},{key:"failDetailNoData",group:"poor_mgmt",label:"데이터분석부재"},{key:"failDetailNoExternal",group:"env_fail",label:"외부변수고려부족"},{key:"failDetailNoRiskPlan",group:"env_fail",label:"리스크대비계획없음"},{key:"failDetailNoResource",group:"env_fail",label:"인력자원부족"},{key:"failDetailRoleDup",group:"communication",label:"역할중복"},{key:"failDetailGap",group:"communication",label:"공백"},{key:"failDetailCollapse",group:"communication",label:"협업붕괴"},{key:"failDetailDelay",group:"communication",label:"업무지연"}]},1506:(e,a,l)=>{"use strict";l.r(a),l.d(a,{default:()=>o,metadata:()=>t});var i=l(9510);l(7272);let t={title:"교통과 체크리스트",description:"베드로 지파 교통과 월간 업무계획 달성 관리 시스템"};function o({children:e}){return i.jsx("html",{lang:"ko",children:i.jsx("body",{className:"bg-[var(--bg)]",children:e})})}},1857:(e,a,l)=>{"use strict";l.d(a,{ZP:()=>s});var i=l(8570);let t=(0,i.createProxy)(String.raw`C:\next-js\traffic-checklist\components\Sidebar.tsx`),{__esModule:o,$$typeof:r}=t;t.default;let s=(0,i.createProxy)(String.raw`C:\next-js\traffic-checklist\components\Sidebar.tsx#default`)},9487:(e,a,l)=>{"use strict";l.d(a,{ZP:()=>r,qZ:()=>s});var i=l(5900);let t=null;function o(){return t||(t=new i.Pool({connectionString:process.env.VPG_DATABASE_URL,ssl:"disable"!==process.env.VPG_SSLMODE&&{rejectUnauthorized:!1}})),t}let r=o();async function s(){let e=await o().connect();try{for(let a of(await e.query(`
      CREATE TABLE IF NOT EXISTS churches (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        "order" INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `),await e.query(`
      CREATE TABLE IF NOT EXISTS focus_areas (
        id SERIAL PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        "order" INT NOT NULL
      )
    `),await e.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        zion_new_no TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'member',
        church_id TEXT REFERENCES churches(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `),await e.query(`
      CREATE TABLE IF NOT EXISTS checklist_items (
        id TEXT PRIMARY KEY,
        church_id TEXT NOT NULL REFERENCES churches(id),
        focus_area_id INT NOT NULL REFERENCES focus_areas(id),
        year INT NOT NULL,
        month INT NOT NULL,
        title TEXT NOT NULL,
        target_date TEXT,
        "order" INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `),await e.query(`
      CREATE TABLE IF NOT EXISTS checklist_results (
        id TEXT PRIMARY KEY,
        item_id TEXT UNIQUE NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
        church_id TEXT NOT NULL,
        year INT NOT NULL,
        month INT NOT NULL,
        is_done BOOLEAN DEFAULT false,
        achieve_type_schedule BOOLEAN DEFAULT false,
        achieve_type_intensive BOOLEAN DEFAULT false,
        achieve_type_habit BOOLEAN DEFAULT false,
        achieve_type_role BOOLEAN DEFAULT false,
        fail_type TEXT,
        fail_detail_goal_vague BOOLEAN DEFAULT false,
        fail_detail_goal_unrealistic BOOLEAN DEFAULT false,
        fail_detail_goal_priority BOOLEAN DEFAULT false,
        fail_detail_no_schedule BOOLEAN DEFAULT false,
        fail_detail_no_step_plan BOOLEAN DEFAULT false,
        fail_detail_no_assignee BOOLEAN DEFAULT false,
        fail_detail_work_condition BOOLEAN DEFAULT false,
        fail_detail_time_short BOOLEAN DEFAULT false,
        fail_detail_no_repeat BOOLEAN DEFAULT false,
        fail_detail_lost_motivation BOOLEAN DEFAULT false,
        fail_detail_postpone BOOLEAN DEFAULT false,
        fail_detail_no_mid_check BOOLEAN DEFAULT false,
        fail_detail_late_response BOOLEAN DEFAULT false,
        fail_detail_no_data BOOLEAN DEFAULT false,
        fail_detail_no_external BOOLEAN DEFAULT false,
        fail_detail_no_risk_plan BOOLEAN DEFAULT false,
        fail_detail_no_resource BOOLEAN DEFAULT false,
        fail_detail_role_dup BOOLEAN DEFAULT false,
        fail_detail_gap BOOLEAN DEFAULT false,
        fail_detail_collapse BOOLEAN DEFAULT false,
        fail_detail_delay BOOLEAN DEFAULT false,
        note TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `),[{id:"gwangju",code:"gwangju",name:"광주",order:1},{id:"mokpo",code:"mokpo",name:"목포",order:2},{id:"yeosu",code:"yeosu",name:"여수",order:3},{id:"suncheon",code:"suncheon",name:"순천",order:4},{id:"songha",code:"songha",name:"송하",order:5},{id:"gwangyang",code:"gwangyang",name:"광양",order:6},{id:"haenam",code:"haenam",name:"해남",order:7},{id:"naju",code:"naju",name:"나주",order:8}]))await e.query('INSERT INTO churches (id, code, name, "order") VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING',[a.id,a.code,a.name,a.order]);for(let a of[{code:"event_support",name:"행사시 교통업무 지원",order:1},{code:"org_operation",name:"상시조직 구성 및 운영",order:2},{code:"vehicle_mgmt",name:"차량 및 주차장 관리",order:3},{code:"church_support",name:"지교회 업무지원 / 부서원 충원 및 신앙관리",order:4}])await e.query('INSERT INTO focus_areas (code, name, "order") VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',[a.code,a.name,a.order]);return{ok:!0}}finally{e.release()}}},7272:()=>{}};