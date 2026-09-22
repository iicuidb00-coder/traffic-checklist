"use strict";exports.id=715,exports.ids=[715],exports.modules={2031:(e,t,r)=>{r.d(t,{E:()=>s,G:()=>o});var a=r(8757);async function o(){let e=await (0,a.cookies)(),t=e.get("session")?.value;if(!t)return null;try{return JSON.parse(Buffer.from(t,"base64").toString("utf-8"))}catch{return null}}function s(e){return Buffer.from(JSON.stringify(e)).toString("base64")}},9487:(e,t,r)=>{r.d(t,{Z:()=>o,q:()=>s});let a=new(r(5900)).Pool({connectionString:process.env.VPG_DATABASE_URL,ssl:"disable"!==process.env.VPG_SSLMODE&&void 0}),o=a;async function s(){let e=await a.connect();try{for(let t of(await e.query(`
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
    `),[{id:"gwangju",code:"gwangju",name:"광주",order:1},{id:"mokpo",code:"mokpo",name:"목포",order:2},{id:"yeosu",code:"yeosu",name:"여수",order:3},{id:"suncheon",code:"suncheon",name:"순천",order:4},{id:"songha",code:"songha",name:"송하",order:5},{id:"gwangyang",code:"gwangyang",name:"광양",order:6},{id:"haenam",code:"haenam",name:"해남",order:7},{id:"naju",code:"naju",name:"나주",order:8}]))await e.query('INSERT INTO churches (id, code, name, "order") VALUES ($1, $2, $3, $4) ON CONFLICT (code) DO NOTHING',[t.id,t.code,t.name,t.order]);for(let t of[{code:"event_support",name:"행사시 교통업무 지원",order:1},{code:"org_operation",name:"상시조직 구성 및 운영",order:2},{code:"vehicle_mgmt",name:"차량 및 주차장 관리",order:3},{code:"church_support",name:"지교회 업무지원 / 부서원 충원 및 신앙관리",order:4}])await e.query('INSERT INTO focus_areas (code, name, "order") VALUES ($1, $2, $3) ON CONFLICT (code) DO NOTHING',[t.code,t.name,t.order]);return{ok:!0}}finally{e.release()}}},3085:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"DraftMode",{enumerable:!0,get:function(){return s}});let a=r(5869),o=r(6278);class s{get isEnabled(){return this._provider.isEnabled}enable(){let e=a.staticGenerationAsyncStorage.getStore();return e&&(0,o.trackDynamicDataAccessed)(e,"draftMode().enable()"),this._provider.enable()}disable(){let e=a.staticGenerationAsyncStorage.getStore();return e&&(0,o.trackDynamicDataAccessed)(e,"draftMode().disable()"),this._provider.disable()}constructor(e){this._provider=e}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8757:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{cookies:function(){return u},draftMode:function(){return E},headers:function(){return f}});let a=r(8996),o=r(3047),s=r(2044),n=r(2934),i=r(3085),l=r(6278),d=r(5869),c=r(4580);function f(){let e="headers",t=d.staticGenerationAsyncStorage.getStore();if(t){if(t.forceStatic)return o.HeadersAdapter.seal(new Headers({}));(0,l.trackDynamicDataAccessed)(t,e)}return(0,c.getExpectedRequestStore)(e).headers}function u(){let e="cookies",t=d.staticGenerationAsyncStorage.getStore();if(t){if(t.forceStatic)return a.RequestCookiesAdapter.seal(new s.RequestCookies(new Headers({})));(0,l.trackDynamicDataAccessed)(t,e)}let r=(0,c.getExpectedRequestStore)(e),o=n.actionAsyncStorage.getStore();return(null==o?void 0:o.isAction)||(null==o?void 0:o.isAppRoute)?r.mutableCookies:r.cookies}function E(){let e=(0,c.getExpectedRequestStore)("draftMode");return new i.DraftMode(e.draftMode)}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},3047:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{HeadersAdapter:function(){return s},ReadonlyHeadersError:function(){return o}});let a=r(8238);class o extends Error{constructor(){super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers")}static callable(){throw new o}}class s extends Headers{constructor(e){super(),this.headers=new Proxy(e,{get(t,r,o){if("symbol"==typeof r)return a.ReflectAdapter.get(t,r,o);let s=r.toLowerCase(),n=Object.keys(e).find(e=>e.toLowerCase()===s);if(void 0!==n)return a.ReflectAdapter.get(t,n,o)},set(t,r,o,s){if("symbol"==typeof r)return a.ReflectAdapter.set(t,r,o,s);let n=r.toLowerCase(),i=Object.keys(e).find(e=>e.toLowerCase()===n);return a.ReflectAdapter.set(t,i??r,o,s)},has(t,r){if("symbol"==typeof r)return a.ReflectAdapter.has(t,r);let o=r.toLowerCase(),s=Object.keys(e).find(e=>e.toLowerCase()===o);return void 0!==s&&a.ReflectAdapter.has(t,s)},deleteProperty(t,r){if("symbol"==typeof r)return a.ReflectAdapter.deleteProperty(t,r);let o=r.toLowerCase(),s=Object.keys(e).find(e=>e.toLowerCase()===o);return void 0===s||a.ReflectAdapter.deleteProperty(t,s)}})}static seal(e){return new Proxy(e,{get(e,t,r){switch(t){case"append":case"delete":case"set":return o.callable;default:return a.ReflectAdapter.get(e,t,r)}}})}merge(e){return Array.isArray(e)?e.join(", "):e}static from(e){return e instanceof Headers?e:new s(e)}append(e,t){let r=this.headers[e];"string"==typeof r?this.headers[e]=[r,t]:Array.isArray(r)?r.push(t):this.headers[e]=t}delete(e){delete this.headers[e]}get(e){let t=this.headers[e];return void 0!==t?this.merge(t):null}has(e){return void 0!==this.headers[e]}set(e,t){this.headers[e]=t}forEach(e,t){for(let[r,a]of this.entries())e.call(t,a,r,this)}*entries(){for(let e of Object.keys(this.headers)){let t=e.toLowerCase(),r=this.get(t);yield[t,r]}}*keys(){for(let e of Object.keys(this.headers)){let t=e.toLowerCase();yield t}}*values(){for(let e of Object.keys(this.headers)){let t=this.get(e);yield t}}[Symbol.iterator](){return this.entries()}}},8238:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"ReflectAdapter",{enumerable:!0,get:function(){return r}});class r{static get(e,t,r){let a=Reflect.get(e,t,r);return"function"==typeof a?a.bind(e):a}static set(e,t,r,a){return Reflect.set(e,t,r,a)}static has(e,t){return Reflect.has(e,t)}static deleteProperty(e,t){return Reflect.deleteProperty(e,t)}}},8996:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{MutableRequestCookiesAdapter:function(){return f},ReadonlyRequestCookiesError:function(){return n},RequestCookiesAdapter:function(){return i},appendMutableCookies:function(){return c},getModifiedCookieValues:function(){return d}});let a=r(2044),o=r(8238),s=r(5869);class n extends Error{constructor(){super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#cookiessetname-value-options")}static callable(){throw new n}}class i{static seal(e){return new Proxy(e,{get(e,t,r){switch(t){case"clear":case"delete":case"set":return n.callable;default:return o.ReflectAdapter.get(e,t,r)}}})}}let l=Symbol.for("next.mutated.cookies");function d(e){let t=e[l];return t&&Array.isArray(t)&&0!==t.length?t:[]}function c(e,t){let r=d(t);if(0===r.length)return!1;let o=new a.ResponseCookies(e),s=o.getAll();for(let e of r)o.set(e);for(let e of s)o.set(e);return!0}class f{static wrap(e,t){let r=new a.ResponseCookies(new Headers);for(let t of e.getAll())r.set(t);let n=[],i=new Set,d=()=>{let e=s.staticGenerationAsyncStorage.getStore();if(e&&(e.pathWasRevalidated=!0),n=r.getAll().filter(e=>i.has(e.name)),t){let e=[];for(let t of n){let r=new a.ResponseCookies(new Headers);r.set(t),e.push(r.toString())}t(e)}};return new Proxy(r,{get(e,t,r){switch(t){case l:return n;case"delete":return function(...t){i.add("string"==typeof t[0]?t[0]:t[0].name);try{e.delete(...t)}finally{d()}};case"set":return function(...t){i.add("string"==typeof t[0]?t[0]:t[0].name);try{return e.set(...t)}finally{d()}};default:return o.ReflectAdapter.get(e,t,r)}}})}}}};