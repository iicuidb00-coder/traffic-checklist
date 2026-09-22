exports.id=487,exports.ids=[487],exports.modules={5346:(e,a,s)=>{Promise.resolve().then(s.bind(s,4458)),Promise.resolve().then(s.bind(s,8633))},4458:(e,a,s)=>{"use strict";s.d(a,{default:()=>r});var i=s(326),l=s(7577),t=s(6260);function r({churchId:e,churchName:a,year:s,month:r,initialItems:d,readonly:n=!1}){let[c,o]=(0,l.useState)(d),[h,T]=(0,l.useState)({}),[p,N]=(0,l.useState)({}),[y,E]=(0,l.useState)({}),[u,f]=(0,l.useState)({}),[m,x]=(0,l.useState)(""),[v,L]=(0,l.useState)("ok"),_=(e,a="ok")=>{x(e),L(a),setTimeout(()=>x(""),2500)},g=c.length,j=c.filter(e=>e.result?.isDone).length,O=g>0?Math.round(j/g*100):0,A=async a=>{let i=h[a]?.trim();if(!i)return;let l=await fetch("/api/checklist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({churchId:e,focusAreaId:a,year:s,month:r,title:i,targetDate:p[a]??""})});if(l.ok){let e=await l.json();o(s=>[...s,{...e,focusAreaId:e.focus_area_id??a,result:null}]),T(e=>({...e,[a]:""})),N(e=>({...e,[a]:""})),_("항목이 추가되었습니다")}},k=async e=>{confirm("항목을 삭제할까요?")&&(await fetch("/api/checklist/items",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e})})).ok&&(o(a=>a.filter(a=>a.id!==e)),_("삭제되었습니다"))},b=(0,l.useCallback)(async(e,a)=>{o(s=>s.map(s=>s.id===e?{...s,result:{...s.result??{isDone:!1,achieveTypes:[],failType:null,failDetails:[],note:""},...a}}:s))},[]),D=async e=>{let a=c.find(a=>a.id===e);if(a){f(a=>({...a,[e]:!0}));try{await fetch("/api/checklist/result",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({itemId:e,...a.result})}),_("저장되었습니다")}catch{_("저장 실패","err")}finally{f(a=>({...a,[e]:!1}))}}};return(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{className:"stat-strip",style:{marginBottom:16},children:[(0,i.jsxs)("div",{className:"stat",children:[(0,i.jsxs)("div",{className:"stat-top",children:[i.jsx("div",{className:"stat-dot",style:{background:"var(--accent)"}}),(0,i.jsxs)("div",{className:"stat-label",children:[a," \xb7 ",s,"년 ",r,"월"]})]}),(0,i.jsxs)("div",{className:"stat-value",style:{color:O>=80?"var(--ok)":O>=60?"var(--accent)":O>=40?"var(--warn)":"var(--bad)"},children:[O,"%"]}),(0,i.jsxs)("div",{className:"stat-delta",children:[j," / ",g," 달성"]})]}),(0,i.jsxs)("div",{className:"stat",children:[(0,i.jsxs)("div",{className:"stat-top",children:[i.jsx("div",{className:"stat-dot",style:{background:"var(--ok)"}}),i.jsx("div",{className:"stat-label",children:"달성 항목"})]}),(0,i.jsxs)("div",{className:"stat-value",style:{color:"var(--ok)"},children:[j,"개"]}),i.jsx("div",{className:"stat-delta",children:"체크 완료"})]}),(0,i.jsxs)("div",{className:"stat",children:[(0,i.jsxs)("div",{className:"stat-top",children:[i.jsx("div",{className:"stat-dot",style:{background:"var(--bad)"}}),i.jsx("div",{className:"stat-label",children:"미달성 항목"})]}),(0,i.jsxs)("div",{className:"stat-value",style:{color:"var(--bad)"},children:[g-j,"개"]}),i.jsx("div",{className:"stat-delta",children:"추가 확인 필요"})]}),(0,i.jsxs)("div",{className:"stat",children:[(0,i.jsxs)("div",{className:"stat-top",children:[i.jsx("div",{className:"stat-dot",style:{background:"var(--neu)"}}),i.jsx("div",{className:"stat-label",children:"전체 항목"})]}),(0,i.jsxs)("div",{className:"stat-value",children:[g,"개"]}),i.jsx("div",{className:"stat-delta",children:"이번 달 계획"})]})]}),m&&i.jsx("div",{className:`badge ${"ok"===v?"success":"danger"}`,style:{marginBottom:12,display:"block",padding:"8px 12px",borderRadius:6},children:m}),t.rF.map(e=>{let a=c.filter(a=>a.focusAreaId===e.id),s=a.filter(e=>e.result?.isDone).length;return(0,i.jsxs)("div",{className:"panel",style:{marginBottom:12},children:[(0,i.jsxs)("div",{className:"panel-head",children:[i.jsx("div",{className:"gem m",style:{background:"var(--accent-weak)",color:"var(--accent-ink)",fontWeight:800},children:e.id}),i.jsx("span",{className:"panel-title",children:e.name}),i.jsx("span",{className:"panel-sub",children:(0,i.jsxs)("span",{className:`badge ${s===a.length&&a.length>0?"success":"neutral"}`,children:[s,"/",a.length]})})]}),i.jsx("div",{className:"tbl-wrap",children:(0,i.jsxs)("table",{className:"tbl",children:[i.jsx("thead",{children:(0,i.jsxs)("tr",{children:[i.jsx("th",{style:{width:40},children:"완료"}),i.jsx("th",{children:"월간 추진 리스트"}),i.jsx("th",{style:{width:120},children:"목표일자"}),i.jsx("th",{style:{width:80},children:"상태"}),i.jsx("th",{style:{width:80},children:"상세"}),!n&&i.jsx("th",{style:{width:50},children:"삭제"})]})}),i.jsx("tbody",{children:0===a.length?i.jsx("tr",{children:i.jsx("td",{colSpan:n?5:6,style:{textAlign:"center",color:"var(--ink-3)",padding:"20px"},children:"항목이 없습니다"})}):a.map(e=>{let a=e.result??{isDone:!1,achieveTypes:[],failType:null,failDetails:[],note:""},s=y[e.id];return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("tr",{style:{background:a.isDone?"var(--ok-bg)":void 0},children:[i.jsx("td",{style:{textAlign:"center"},children:i.jsx("button",{disabled:n,onClick:()=>b(e.id,{isDone:!a.isDone}),style:{background:"none",border:"none",cursor:n?"default":"pointer",fontSize:18},children:a.isDone?"✅":"⬜"})}),i.jsx("td",{style:{textDecoration:a.isDone?"line-through":"none",color:a.isDone?"var(--ink-3)":"var(--ink)"},children:e.title}),i.jsx("td",{style:{color:"var(--ink-3)",fontSize:12},children:e.targetDate??"-"}),i.jsx("td",{children:a.isDone?i.jsx("span",{className:"badge success",children:"달성"}):a.failType?i.jsx("span",{className:"badge danger",children:"미달성"}):i.jsx("span",{className:"badge neutral",children:"미입력"})}),i.jsx("td",{children:!n&&i.jsx("button",{onClick:()=>E(a=>({...a,[e.id]:!a[e.id]})),className:"btn",style:{height:26,padding:"0 10px",fontSize:11},children:s?"닫기":"입력"})}),!n&&i.jsx("td",{children:i.jsx("button",{onClick:()=>k(e.id),style:{background:"none",border:"none",cursor:"pointer",color:"var(--bad)",fontSize:14},children:"✕"})})]},e.id),s&&!n&&i.jsx("tr",{children:(0,i.jsxs)("td",{colSpan:6,style:{background:"var(--surface-2)",padding:"16px"},children:[a.isDone?(0,i.jsxs)("div",{children:[i.jsx("div",{className:"overline",style:{marginBottom:8},children:"달성 유형 (복수 선택)"}),i.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12},children:t.aP.map(s=>(0,i.jsxs)("label",{style:{cursor:"pointer"},children:[i.jsx("input",{type:"checkbox",className:"hidden",checked:a.achieveTypes?.includes(s.key)??!1,onChange:i=>{let l=i.target.checked?[...a.achieveTypes??[],s.key]:(a.achieveTypes??[]).filter(e=>e!==s.key);b(e.id,{achieveTypes:l})},style:{display:"none"}}),i.jsx("span",{className:"chip",style:{background:a.achieveTypes?.includes(s.key)?"var(--accent)":"var(--surface)",color:a.achieveTypes?.includes(s.key)?"#fff":"var(--ink-2)",borderColor:a.achieveTypes?.includes(s.key)?"var(--accent)":"var(--line-2)",cursor:"pointer"},children:s.label})]},s.key))})]}):(0,i.jsxs)("div",{children:[i.jsx("div",{className:"overline",style:{marginBottom:8},children:"미달성 유형"}),i.jsx("div",{style:{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12},children:t.T_.map(s=>(0,i.jsxs)("label",{style:{cursor:"pointer"},children:[i.jsx("input",{type:"radio",name:`failType-${e.id}`,style:{display:"none"},checked:a.failType===s.key,onChange:()=>b(e.id,{failType:s.key,failDetails:[]})}),i.jsx("span",{className:"chip",style:{background:a.failType===s.key?"var(--bad)":"var(--surface)",color:a.failType===s.key?"#fff":"var(--ink-2)",borderColor:a.failType===s.key?"var(--bad)":"var(--line-2)",cursor:"pointer"},children:s.label})]},s.key))}),a.failType&&(0,i.jsxs)(i.Fragment,{children:[i.jsx("div",{className:"overline",style:{marginBottom:8},children:"세부 원인"}),i.jsx("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12},children:t.Q4.filter(e=>e.group===a.failType).map(s=>(0,i.jsxs)("label",{style:{cursor:"pointer"},children:[i.jsx("input",{type:"checkbox",style:{display:"none"},checked:a.failDetails?.includes(s.key)??!1,onChange:i=>{let l=i.target.checked?[...a.failDetails??[],s.key]:(a.failDetails??[]).filter(e=>e!==s.key);b(e.id,{failDetails:l})}}),i.jsx("span",{className:"badge",style:{background:a.failDetails?.includes(s.key)?"var(--warn)":"var(--warn-bg)",color:a.failDetails?.includes(s.key)?"#fff":"var(--warn)",cursor:"pointer",height:"auto",padding:"3px 8px"},children:s.label})]},s.key))})]})]}),(0,i.jsxs)("div",{style:{marginBottom:12},children:[i.jsx("div",{className:"overline",style:{marginBottom:6},children:"비고"}),i.jsx("textarea",{rows:2,value:a.note??"",onChange:a=>b(e.id,{note:a.target.value}),placeholder:"특이사항을 입력하세요",style:{width:"100%",padding:"8px 10px",border:"1px solid var(--line-2)",borderRadius:6,fontSize:13,fontFamily:"inherit",resize:"none",background:"var(--surface)"}})]}),i.jsx("div",{style:{display:"flex",justifyContent:"flex-end"},children:i.jsx("button",{onClick:()=>D(e.id),disabled:u[e.id],className:"btn primary",children:u[e.id]?"저장 중...":"저장"})})]})},`${e.id}-detail`)]})})})]})}),!n&&(0,i.jsxs)("div",{className:"panel-body",style:{borderTop:"1px solid var(--line)",display:"flex",gap:8},children:[i.jsx("input",{type:"text",value:h[e.id]??"",onChange:a=>T(s=>({...s,[e.id]:a.target.value})),onKeyDown:a=>{"Enter"===a.key&&A(e.id)},placeholder:"월간 추진 리스트 항목 추가...",style:{flex:1,padding:"7px 10px",border:"1px solid var(--line-2)",borderRadius:6,fontSize:13,fontFamily:"inherit"}}),i.jsx("input",{type:"text",value:p[e.id]??"",onChange:a=>N(s=>({...s,[e.id]:a.target.value})),placeholder:"목표일자",style:{width:110,padding:"7px 10px",border:"1px solid var(--line-2)",borderRadius:6,fontSize:13,fontFamily:"inherit"}}),i.jsx("button",{onClick:()=>A(e.id),className:"btn primary",children:"+ 추가"})]})]},e.id)})]})}},8858:(e,a,s)=>{"use strict";s.d(a,{ZP:()=>d});var i=s(8570);let l=(0,i.createProxy)(String.raw`C:\next-js\traffic-checklist\components\ChecklistEditor.tsx`),{__esModule:t,$$typeof:r}=l;l.default;let d=(0,i.createProxy)(String.raw`C:\next-js\traffic-checklist\components\ChecklistEditor.tsx#default`)},9487:(e,a,s)=>{"use strict";s.d(a,{Z:()=>l,q:()=>t});let i=new(s(5900)).Pool({connectionString:process.env.VPG_DATABASE_URL,ssl:"disable"!==process.env.VPG_SSLMODE&&void 0}),l=i;async function t(){let e=await i.connect();try{for(let a of(await e.query(`
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
    `),[{id:"gwangju",code:"gwangju",name:"광주",order:1},{id:"mokpo",code:"mokpo",name:"목포",order:2},{id:"yeosu",code:"yeosu",name:"여수",order:3},{id:"suncheon",code:"suncheon",name:"순천",order:4},{id:"songha",code:"songha",name:"송하",order:5},{id:"gwangyang",code:"gwangyang",name:"광양",order:6},{id:"haenam",code:"haenam",name:"해남",order:7},{id:"naju",code:"naju",name:"나주",order:8}]))await e.query('INSERT INTO churches (id, code, name, "order") VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING',[a.id,a.code,a.name,a.order]);for(let a of[{code:"event_support",name:"행사시 교통업무 지원",order:1},{code:"org_operation",name:"상시조직 구성 및 운영",order:2},{code:"vehicle_mgmt",name:"차량 및 주차장 관리",order:3},{code:"church_support",name:"지교회 업무지원 / 부서원 충원 및 신앙관리",order:4}])await e.query('INSERT INTO focus_areas (code, name, "order") VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',[a.code,a.name,a.order]);return{ok:!0}}finally{e.release()}}}};