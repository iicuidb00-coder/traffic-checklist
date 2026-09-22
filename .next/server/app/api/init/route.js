"use strict";(()=>{var e={};e.id=946,e.ids=[946],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5900:e=>{e.exports=require("pg")},6113:e=>{e.exports=require("crypto")},5464:(e,a,t)=>{t.r(a),t.d(a,{originalPathname:()=>L,patchFetch:()=>f,requestAsyncStorage:()=>l,routeModule:()=>c,serverHooks:()=>N,staticGenerationAsyncStorage:()=>u});var r={};t.r(r),t.d(r,{GET:()=>E,dynamic:()=>T});var o=t(9303),i=t(8716),d=t(670),_=t(7070),n=t(9487),s=t(6113);let T="force-dynamic";async function E(e){if(e.nextUrl.searchParams.get("secret")!==process.env.INIT_SECRET)return _.NextResponse.json({error:"forbidden"},{status:403});try{await (0,n.qZ)();let e=await n.ZP.connect();try{for(let a of(await e.query(`
        CREATE TABLE IF NOT EXISTS sub_plans (
          id SERIAL PRIMARY KEY,
          focus_area_id INT NOT NULL REFERENCES focus_areas(id),
          content TEXT NOT NULL,
          "order" INT DEFAULT 0
        )
      `),[{focus_area_id:1,content:"1) 행사별 업무매뉴얼 1차 점검 <1-4분기 내 / 지파,광주>",order:1},{focus_area_id:1,content:"2) TF팀별 조직 구성, 업무기준 1차 점검 <1-4분기 내 / 지파,광주>",order:2},{focus_area_id:2,content:"1) 안내차량팀 조직구성 재편성 <1-4분기 / 지파,광주>",order:1},{focus_area_id:2,content:"2) 안내차량 정기모임 운영 < 매월 1회 / 지파,광주>",order:2},{focus_area_id:2,content:"3) TF팀 정기모임(교류+소통) < 매월 1회 이상 / 지파,광주>",order:3},{focus_area_id:2,content:"4) 교통과 팀장 업무개편 및 교회별 기준마련 <1-4분기, 4개팀/팀장>",order:4},{focus_area_id:3,content:"1) 상시 점검 <일일별,주간별 / 지파,광주>",order:1},{focus_area_id:3,content:"2) 정기 및 집중점검 <매월,분기별,년2회 / 총회,지파,광주>",order:2},{focus_area_id:3,content:"3) 차량정비 교회별 지정정비소 선정 <지파/광주>",order:3},{focus_area_id:3,content:"4) 불법단속차량,주차민원차량 벌칙제 시행 <매월/광주>",order:4},{focus_area_id:3,content:"5) 성전주차장 비표제, 성도차량등록 시스탬화 시행 <1-4분기 중, 광주>",order:5},{focus_area_id:4,content:"1) 교통과/TF팀 사명자 직무교육 : 년 1~2회",order:1},{focus_area_id:4,content:"2) TF팀 업무매뉴얼, 정기실무교육, 정기모임",order:2},{focus_area_id:4,content:"3) 행사+모임+투어+방문차량 보고 및 입차 기준마련 <1-4분기 내, 광주>",order:3},{focus_area_id:4,content:"1) 구역예배(과-주1회), 천국고시(년1회-단계별)",order:4},{focus_area_id:4,content:"2) 팀별+팀장님별 주요업무 주도 역할 부여",order:5}]))await e.query('INSERT INTO sub_plans (focus_area_id, content, "order") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',[a.focus_area_id,a.content,a.order]);let a=(await e.query("SELECT id FROM churches WHERE code = 'gwangju'")).rows[0];if(a){let t=await e.query("SELECT COUNT(*) FROM checklist_items WHERE church_id = $1 AND year = $2 AND month = $3",[a.id,2026,9]);if(0===Number(t.rows[0].count)){let t=[{focus_area_id:1,title:"행사 업무별 매뉴얼 취합 및 점검 < 지파,광주 >",target_date:"넷째주(28,월)"},{focus_area_id:1,title:"TF팀별 및 팀장연합 실무교육 및 의견수렴 < 광주 >",target_date:"넷째주(28,월)"},{focus_area_id:2,title:"안내차량 광주 정기모임",target_date:"셋째주(20,일)"},{focus_area_id:2,title:"교통과장(월2회-수)/4대팀장(매월1회-수) 정기모임",target_date:"둘째주(9,수), 다섯째주(30,수)"},{focus_area_id:2,title:"지파 TF팀 정기모임",target_date:"다섯째주(30,수)"},{focus_area_id:2,title:"광주 TF팀 실무교육",target_date:"둘째주(10,목), 셋째주(17,목)"},{focus_area_id:3,title:"성전주차장 비표제 시행",target_date:"매월 수,주일 예배(월 주 2회씩)"},{focus_area_id:3,title:"성도차량등록 시스탬 시행",target_date:"둘째주(13,일), 넷째주(27,일)"},{focus_area_id:4,title:"행사,모임,투어,방문차량 보고 (상시)",target_date:"(상시)"},{focus_area_id:4,title:"구역예배 진행",target_date:"(매주 7,14,21,28 1회-월)"},{focus_area_id:4,title:"천국고시 과제제출",target_date:"(매주 5,12,19 1회-토)"}];for(let r=0;r<t.length;r++)await e.query(`INSERT INTO checklist_items (id, church_id, focus_area_id, year, month, title, target_date, "order")
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,[(0,s.randomUUID)(),a.id,t[r].focus_area_id,2026,9,t[r].title,t[r].target_date,r])}}return _.NextResponse.json({ok:!0,message:"DB 초기화 및 시드 완료"})}finally{e.release()}}catch(e){return _.NextResponse.json({error:e.message},{status:500})}}let c=new o.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/api/init/route",pathname:"/api/init",filename:"route",bundlePath:"app/api/init/route"},resolvedPagePath:"C:\\next-js\\traffic-checklist\\app\\api\\init\\route.ts",nextConfigOutput:"standalone",userland:r}),{requestAsyncStorage:l,staticGenerationAsyncStorage:u,serverHooks:N}=c,L="/api/init/route";function f(){return(0,d.patchFetch)({serverHooks:N,staticGenerationAsyncStorage:u})}},9487:(e,a,t)=>{t.d(a,{ZP:()=>d,qZ:()=>_});var r=t(5900);let o=null;function i(){return o||(o=new r.Pool({connectionString:process.env.VPG_DATABASE_URL,ssl:"disable"!==process.env.VPG_SSLMODE&&{rejectUnauthorized:!1}})),o}let d=i();async function _(){let e=await i.connect();try{for(let a of(await e.query(`
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
    `),[{id:"gwangju",code:"gwangju",name:"광주",order:1},{id:"mokpo",code:"mokpo",name:"목포",order:2},{id:"yeosu",code:"yeosu",name:"여수",order:3},{id:"suncheon",code:"suncheon",name:"순천",order:4},{id:"songha",code:"songha",name:"송하",order:5},{id:"gwangyang",code:"gwangyang",name:"광양",order:6},{id:"haenam",code:"haenam",name:"해남",order:7},{id:"naju",code:"naju",name:"나주",order:8}]))await e.query('INSERT INTO churches (id, code, name, "order") VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING',[a.id,a.code,a.name,a.order]);for(let a of[{code:"event_support",name:"행사시 교통업무 지원",order:1},{code:"org_operation",name:"상시조직 구성 및 운영",order:2},{code:"vehicle_mgmt",name:"차량 및 주차장 관리",order:3},{code:"church_support",name:"지교회 업무지원 / 부서원 충원 및 신앙관리",order:4}])await e.query('INSERT INTO focus_areas (code, name, "order") VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',[a.code,a.name,a.order]);return{ok:!0}}finally{e.release()}}}};var a=require("../../../webpack-runtime.js");a.C(e);var t=e=>a(a.s=e),r=a.X(0,[948,972],()=>t(5464));module.exports=r})();